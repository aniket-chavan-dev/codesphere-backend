from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from .serializer import ProblemSetSerailizer
from .pagination import ProblemSetPagination
from .models import Problems
from rest_framework.response import Response
from rest_framework import status
from runcode.models import Code
from rest_framework.permissions import AllowAny
# Create your views here.

class GetProblemSet(ListAPIView):
    queryset = Problems.objects.all().order_by('id')
    serializer_class = ProblemSetSerailizer
    pagination_class = ProblemSetPagination
    filter_backends = [SearchFilter]
    search_fields = ['title','category'] 
    permission_classes = [AllowAny]          
    authentication_classes = []

class GetProblem(APIView):
    permission_classes = [AllowAny]        
    authentication_classes = []
    
    def get(self,req,title):
        code = ""
        instance = Problems.objects.filter(title=title).first()
        if req.user.is_authenticated:
            code_instance = Code.objects.filter(problem_id = instance.id,user_id = req.user.id).first()
            if code_instance is not None:
                code = code_instance.code
                print(code)
        if instance is not None:
            serializer = ProblemSetSerailizer(instance)
            return Response(data={
                'data' : serializer.data,
                'code' : code
            },status=status.HTTP_200_OK)
        return Response({'msg' : "not found"},status=status.HTTP_404_NOT_FOUND)