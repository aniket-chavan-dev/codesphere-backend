from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import requests
import json
from json import JSONDecodeError
from .models import Code
from problems.models import Problems
from .utility import convert_user_code_into_execution
from codeexequeue.models import CodeQueue
class RunPublicTestCases(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,req):
        if req.method == "POST":
            user = req.user
            code = req.data['code']
            problem_id = req.data['id']
            test_cases = req.data['payload']
            code_instance = Code.objects.filter(problem_id = problem_id,user_id = user.id).first()
            if code_instance is None:
                new_code_instance = Code.objects.create(
                    code = code,
                    user = user,
                    problem = Problems.objects.get(id = problem_id)
                )
            else :
                code_instance.code = code
                code_instance.save()
            #the code is converted into a format which can be executed with the test cases
            updated_code = convert_user_code_into_execution(code=code,test_cases=test_cases)

            job = CodeQueue.objects.create(
                code = updated_code,
                user_id = user.id,
                problem_id = problem_id,
            )

            res = {
                'status' : 'pending',
                'jobid' : job.id
            }

            return Response(res,status=status.HTTP_200_OK)



            # url = "https://codespherejudge-1.onrender.com/run/"
            # data = {
            #     'code' : updated_code
            # }
            # print(updated_code)
            # try:
            #     res = requests.post(url=url, data=json.dumps(data))
            #     try:
            #         result_json = res.json()
            #     except JSONDecodeError:
            #         return Response(
            #             {
            #                 'error': 'Invalid JSON response from microservice',
            #                 'response_text': res.text,
            #                 'test_cases' : test_cases['test_cases']
            #             },
            #             status=status.HTTP_502_BAD_GATEWAY
            #         )

            #     return Response({'result': result_json,'test_cases' : test_cases['test_cases']}, status=status.HTTP_200_OK)

            # except requests.exceptions.RequestException as e:
            #     return Response(
            #         {'error': str(e)},
            #         status=status.HTTP_503_SERVICE_UNAVAILABLE
            #     )
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)

