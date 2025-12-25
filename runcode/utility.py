from .models import HeplperFunctions

def convert_user_code_into_execution(code,test_cases):
    updated_code = ""
    if test_cases['is_linkedList'] :
        helper_instance = HeplperFunctions.objects.get(id = 1)
        updated_code += helper_instance.linked_list_helper_function
    if test_cases['is_tree'] :
        helper_instance = HeplperFunctions.objects.get(id = 1)
        updated_code += helper_instance.trees_helper_functions
    updated_code += "\n"
    function_name = test_cases['function_name']
    input_para_list = []
    for i in test_cases['test_cases']:
        inputPara = i['input']
        input_para_list.append(inputPara)
    code += "\n"
    code += f"""\nsol_obj = Solution()\ntest_cases = {test_cases['test_cases']}\nfor data in test_cases:\n\tif {test_cases['is_linkedList']}:"""
    code += "\n\t\tdata['input'] = {key : array_to_linked_list(val) if isinstance(val,list) else val for key,val in data['input'].items()}\n"
    code += f"\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tif {test_cases['need_to_convert_list_tree_to_array']}:\n\t\t\tans = linked_list_to_array(ans)\n\t\tprint(ans)"
    code += f"\n\telif {test_cases['is_tree']}:"
    code += "\n\t\tdata['input'] = {key : array_to_tree(val) if isinstance(val,list) else val for key,val in data['input'].items()}"
    code += f"\n\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tif {test_cases['need_to_convert_list_tree_to_array']}:\n\t\t\tans = tree_to_array(ans)\n\t\tprint(ans)\n\telse:\n\t\tans = sol_obj.{function_name}(**data['input'])\n\t\tprint(ans)"
    updated_code += code
    return updated_code