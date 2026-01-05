from .models import Submissions
import numpy as np
from .models import PrivateTestCases
from decouple import config
from runcode.models import HeplperFunctions
import requests
from groq import Groq
from pydantic import BaseModel
from typing import List, Dict, Any
import json

def generate_histogram(values, unit_label, value_label):
    """
    Generic histogram generator used for both runtime (ms) and memory (MB).
    """
    if not values:
        return {"bin_data": [], "total_submissions": 0, "type": "none"}

    total = len(values)
    min_val, max_val = min(values), max(values)

    # Handle case where all values are the same
    if min_val == max_val:
        return {
            "type": "flat",
            "bin_data": [{value_label: round(min_val, 2), "percentage": 100}],
            "total_submissions": total,
        }

    # Choose number of bins dynamically
    num_bins = 100 if total > 1000 else max(10, total // 10)
    bins = np.linspace(min_val, max_val, num_bins + 1)
    hist, edges = np.histogram(values, bins=bins)
    percentages = (hist / total) * 100

    bin_data = [
        {
            "range": f"{edges[i]:.2f}-{edges[i+1]:.2f} {unit_label}",
            "percentage": round(percentages[i], 2),
        }
        for i in range(num_bins)
    ]

    return {
        "type": "binned",
        "bin_data": bin_data,
        "total_submissions": total,
    }


def runtime_and_memory_histogram(problem_id=None, lang=None, user_submission_id=None):
    """
    Combined histogram for runtime + memory and comparison result.
    """
    # Query all accepted submissions for this problem/lang
    query = Submissions.objects.filter(status="Accepted")
    if problem_id:
        query = query.filter(problem_id=problem_id)
    if lang:
        query = query.filter(lang=lang)

    runtimes_sec = list(query.values_list("execution_time", flat=True))
    memories_mb = list(query.values_list("memory_use", flat=True))  

    # Convert seconds → milliseconds
    runtimes = [r * 1000 for r in runtimes_sec if r is not None]
    memories = [m for m in memories_mb if m is not None]

    runtime_hist = generate_histogram(runtimes, "ms", "runtime")
    memory_hist = generate_histogram(memories, "MB", "memory")

    # 🧮 Calculate how fast user's submission is compared to others
    user_percentile_runtime = None
    user_percentile_memory = None

    if user_submission_id:
        try:
            user_sub = Submissions.objects.get(id=user_submission_id)
            user_runtime = user_sub.execution_time * 1000
            user_memory = user_sub.memory_use

            if runtimes:
                count_faster = sum(r > user_runtime for r in runtimes)
                user_percentile_runtime = round((count_faster / len(runtimes)) * 100, 2)

            if memories:
                count_more_memory = sum(m > user_memory for m in memories)
                user_percentile_memory = round((count_more_memory / len(memories)) * 100, 2)

        except Submissions.DoesNotExist:
            pass

    return {
        "runtime": runtime_hist,
        "memory": memory_hist,
        "user_percentiles": {
            "faster_than": user_percentile_runtime,
            "better_memory_than": user_percentile_memory,
        },
    }



client = Groq(api_key=config("API_KEY"))

class TestCase(BaseModel):
    input: Dict[str, Any]

class TestCaseResponse(BaseModel):
    test_cases: List[TestCase]
    code: str

def code_to_generate_expected_output(code,payload,input_test_cases) :
    updated_code = ""
    # if payload['is_linkedList'] :
    #     helper_instance = HeplperFunctions.objects.get(id = 1)
    #     updated_code += helper_instance.linked_list_helper_function
    # if payload['is_tree'] :
    #     helper_instance = HeplperFunctions.objects.get(id = 1)
    #     updated_code += helper_instance.trees_helper_functions
    updated_code += "\n"
    function_name = payload['function_name']
    input_para_list = []
    for i in payload['test_cases']:
        inputPara = i['input']
        input_para_list.append(inputPara)
    code += "\n"
    code += f"""\nsol_obj = Solution()\ntest_cases = {payload['test_cases']}\nfor data in test_cases:\n\tif {payload['is_linkedList']}:"""
    code += "\n\t\tdata['input'] = {key : array_to_linked_list(val) if isinstance(val,list) else val for key,val in data['input'].items()}\n"
    code += f"\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tif {payload['need_to_convert_list_tree_to_array']}:\n\t\t\tans = linked_list_to_array(ans)\n\t\tprint(ans)"
    code += f"\n\telif {payload['is_tree']}:"
    code += "\n\t\tdata['input'] = {key : array_to_tree(val) if isinstance(val,list) else val for key,val in data['input'].items()}"
    code += f"\n\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tif {payload['need_to_convert_list_tree_to_array']}:\n\t\t\tans = tree_to_array(ans)\n\t\tprint(ans)\n\telse:\n\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tprint(ans)"
    updated_code += code
    return updated_code

def generate_test_cases(problem_instance,code,payload) :
    test_cases_instance = PrivateTestCases.objects.filter(problem_id = problem_instance.id).first()
    if test_cases_instance is None :
        #prompt to give ai to generate test cases 

        system_prompt = """
            You are an expert AI that generates structured JSON data for algorithmic programming problems (like those on LeetCode).

            Your task:
            Read a natural language problem description carefully and produce a JSON object following **exactly** this structure:

            {
            "test_cases": [
                {
                "input": {
                    "parameter1": value,
                    "parameter2": value
                }
                }
            ],
            "code": "Python solution derived logically from the problem description"
            }

            ### STRICT RULES:
            - Output ONLY valid JSON (no markdown, comments, or natural language).
            - Keys: "test_cases" (array of objects) and "code" (string) are mandatory.
            - Each test case's "input" must match the expected input structure described in the problem.
            - The number of test cases should be between 30–40, covering diverse + edge cases.
            - Do NOT include expected outputs.
            - Variable names must use snake_case.
            - "code" must be a full working Python function or class-based solution.
            - Handle any data type (arrays, strings, linked lists, trees, matrices, integers, etc.) automatically.
            - If the problem involves a class (e.g., `class Solution`), generate accordingly.
            - No text before or after the JSON — output only valid JSON.
            """
        user_prompt = f"{problem_instance.description} follow this code structure to write correct output you need to just complete code {code}"

        response = client.chat.completions.create(
            model="moonshotai/kimi-k2-instruct-0905",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "leetcode_test_case_generator",
                    "schema": TestCaseResponse.model_json_schema()
                }
            }
        )

        data = json.loads(response.choices[0].message.content)
        parsed = TestCaseResponse.model_validate(data)
    
        input_test_cases = parsed.test_cases
        solution_code = parsed.code
        executable_code = code_to_generate_expected_output(code=solution_code,payload=payload,input_test_cases=input_test_cases)
        print(executable_code,"code")
        url = config('RUN_CODE_URL')
        data = {
            'code' : executable_code
        }
        try:
            res = requests.post(url=url, data=json.dumps(data))
            try:
                result_json = res.json()
                print("resuly json",result_json)
                code_output = result_json['output']
                for index,output in enumerate(code_output) :
                    input_test_cases[index]['exected_output'] = output
                PrivateTestCases.objects.create(
                    private_test_cases = input_test_cases,
                    code_solution = executable_code,
                    problem = problem_instance
                )

                return {
                    "error" : "",
                    "result" : input_test_cases
                }
                
            except json.JSONDecodeError:
                return {
                    "error" : "failed to convert in python",
                    "result" : []
                }
        except requests.exceptions.RequestException as e:
            return {
                "error" : f"code run error {e}",
                "result" : []
            }

    return {
        "error" : "",
        "result" : []
    }

           



