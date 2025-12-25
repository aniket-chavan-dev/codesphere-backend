
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from runcode.utility import convert_user_code_into_execution
import requests
import json
from json import JSONDecodeError
from runcode.models import Code
from problems.models import Problems
from .models import Submissions
from .serailzer import SubmissionsSerializer
from decouple import config
from .utility import runtime_and_memory_histogram,generate_test_cases
from .models import PrivateTestCases


class SubmitCode(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        if req.method == "POST":
            code_attr = req.data.get("code")
            problem_id = req.data.get('id')
            problem_instance = Problems.objects.get(id = problem_id)
            payload = req.data.get('payload')
            test_cases = payload.get('test_cases')
            private_test_cases_instance = PrivateTestCases.objects.filter(problem_id = problem_id).first()
            if private_test_cases_instance is not None:
                payload['test_cases'] = private_test_cases_instance.private_test_cases
                test_cases =  private_test_cases_instance.private_test_cases
            user = req.user
            code_instance = Code.objects.filter(problem_id = problem_id,user_id = user.id).first()
            if code_instance is None:
                new_code_instance = Code.objects.create(
                    code = code_attr['val'],
                    user = user,
                    problem = Problems.objects.get(id = problem_id)
                )
            else :
                code_instance.code = code_attr['val']
                code_instance.save()
            
            user_complete_code = convert_user_code_into_execution(code=code_attr['val'],test_cases=payload)
            url = config('RUN_CODE_URL')
            data = {
                'code' : user_complete_code
            }
            try:
                res = requests.post(url=url, data=json.dumps(data))
                try:
                    result_json = res.json()
                except JSONDecodeError:
                    return Response(
                        {
                            'error': 'Invalid JSON response from microservice',
                            'response_text': res.text,
                            'payload' : payload,
                            'status' : "Internal Server Error"
                        },
                        status=status.HTTP_502_BAD_GATEWAY
                    )

                expected_output = []
                for output in test_cases :
                    expected_output.append(output['expected_output'])
                user_output = result_json['output']
                error_occured_in_code = result_json['error']
                last_executed_input = []


                #error case run time error
                if error_occured_in_code != "" :
                    #no test cases run
                    if len(user_output) == 0 and len(expected_output) > 0:
                        last_executed_input = test_cases[0]
                    #few test cases run but exception occurs when run
                    else :
                        last_executed_input = test_cases[len(user_output) - 1]

                    submission_data = {
                        'status' : 'Runtime Error',
                        'lang' : code_attr['lang'],
                        'code' : code_attr['val'],
                        'execution_time' : result_json['execution_time'],
                        'memory_use' : result_json['memory_used'],
                        'last_executed_input' : last_executed_input,
                        'error_message' : error_occured_in_code,
                        'total_test_cases' : len(expected_output),
                        'passed_test_cases' : len(user_output)
                    }
                    problem_instance.status = "attempted"
                    problem_instance.submissions_count += 1
                    problem_instance.save()
                    serializer = SubmissionsSerializer(data = submission_data)
                    if serializer.is_valid():
                        submission_instance = serializer.save(
                            user = user,
                            problem = problem_instance
                        )
                        sub_serializer = SubmissionsSerializer(submission_instance)
                        return Response({'sub_data' : sub_serializer.data},status=status.HTTP_200_OK)
                    else :
                        return Response({'error' : serializer.errors},status=status.HTTP_400_BAD_REQUEST)
                #all test cases run
                is_accepted = True
                for index,expected_op in enumerate(expected_output) :
                    if f"{expected_op}" != user_output[index] :
                        print("mismatch",expected_op,user_output[index])
                        is_accepted = False
                        last_executed_input = test_cases[index]
                        submission_data = {
                            'status' : 'Wrong Answer',
                           
                            'lang' : code_attr['lang'],
                            'code' : code_attr['val'],
                            'execution_time' : result_json['execution_time'],
                            'memory_use' : result_json['memory_used'],
                            'last_executed_input' : last_executed_input,
                            'error_message' : error_occured_in_code,
                            'total_test_cases' : len(expected_output),
                            'passed_test_cases' : index,
                            'user_output' : user_output[index],
                          
                        }
                        problem_instance.status = "attempted"
                        problem_instance.submissions_count += 1
                        problem_instance.save()
                        serializer = SubmissionsSerializer(data = submission_data)
                        if serializer.is_valid():
                            submission_instance = serializer.save(
                                user = user,
                                problem = problem_instance
                            )
                            sub_serializer = SubmissionsSerializer(submission_instance)
                            return Response({'sub_data' : sub_serializer.data},status=status.HTTP_200_OK)
                        else :
                            print(serializer.errors)
                            return Response({'error' : serializer.errors},status=status.HTTP_400_BAD_REQUEST)
                if is_accepted :
                    submission_data = {
                        'status' : 'Accepted',
                        'lang' : code_attr['lang'],
                        'code' : code_attr['val'],
                        'execution_time' : result_json['execution_time'],
                        'memory_use' : result_json['memory_used'],
                        'last_executed_input' : {},
                        'error_message' : error_occured_in_code,
                        'total_test_cases' : len(expected_output),
                        'passed_test_cases' : len(expected_output),
                    }
                    problem_instance.status = "solved"
                    problem_instance.submissions_count += 1
                    problem_instance.acceptance_count += 1
                    problem_instance.acceptance_rate = (problem_instance.acceptance_count / problem_instance.submissions_count) * 100
                    problem_instance.save()
                    serializer = SubmissionsSerializer(data = submission_data)
                    if serializer.is_valid():
                        submission_instance = serializer.save(
                            user = user,
                            problem = problem_instance
                        )
                        histogram_data = runtime_and_memory_histogram(problem_id,code_attr['lang'],user_submission_id=submission_instance.id)
                        submission_instance.histogram_data = histogram_data
                        submission_instance.save()
                        sub_serializer = SubmissionsSerializer(submission_instance)
                        return Response({'sub_data' : sub_serializer.data,'histogram_data' : histogram_data},status=status.HTTP_200_OK)
                    else :
                        return Response({'error' : serializer.errors},status=status.HTTP_400_BAD_REQUEST)
                return Response({'result': result_json,'payload' : payload}, status=status.HTTP_200_OK)
            except requests.exceptions.RequestException as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,req,id):
        if req.method == "PUT":
            user = req.user
            text = req.data.get('text')
            indicater = req.data.get('indicater')
            print(text,indicater)
            submission_instance = Submissions.objects.filter(id = id,user_id = user.id).first()
            if submission_instance is None :
                return Response({'error' : 'submission not found'},status=status.HTTP_404_NOT_FOUND)
            submission_instance.note = text
            submission_instance.sub_indicater = indicater
            submission_instance.save()
            serializer = SubmissionsSerializer(submission_instance)
            return Response({'sub_data' : serializer.data},status=status.HTTP_200_OK)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)


class RuntimeMemoryQueries(APIView) :
    permission_classes = [IsAuthenticated]

    def get(self,req):
        if req.method == "GET" :
            range_val = req.GET.get('range')
            query = req.GET.get('query')
            problem_id = req.GET.get('problem_id')
            time_code_data = []
            try :
                low,high = map(float,range_val.split('-'))
                if query == "memory" :
                    submissions = Submissions.objects.filter(status = "Accepted",problem_id = problem_id,memory_use__range = (low,high))[:10]
                    for data in submissions :
                        time_code_data.append({
                            'runtime' : data.memory_use,
                            'code' : data.code
                        })
                else :
                    submissions = Submissions.objects.filter(status = "Accepted",problem_id = problem_id,execution_time__range = (low/1000,high/1000))[:10]
                    print(submissions)
                    for data in submissions :
                        time_code_data.append({
                            'runtime' : data.execution_time*1000,
                            'code' : data.code
                        })
                return Response({'data' : time_code_data,'query' : query},status=status.HTTP_200_OK)

            except ValueError :
                return Response({'error' : 'range is invald'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
          
        
        return Response({'msg' : "method not allowed"})


class ListOfSubmissions(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,req,pk = None) :
        if req.method == "GET":
            if pk is not None:
                queryset = Submissions.objects.filter(user_id = req.user.id,problem_id = pk).order_by('created_at')
                serializer = SubmissionsSerializer(queryset,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)

class PerticularSubmission(APIView):

    def get(self,req,pk = None):
        if req.method == "GET":
            if pk is not None:
                submission = Submissions.objects.filter(id = pk).first()
                if submission is not None:
                    serailizer = SubmissionsSerializer(submission)
                    return Response({'sub_data' : serailizer.data},status=status.HTTP_200_OK)
                return Response({'msg' : 'submission not found'},status=status.HTTP_404_NOT_FOUND)
            return Response({'msg' : 'submission not found'},status=status.HTTP_404_NOT_FOUND)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)()