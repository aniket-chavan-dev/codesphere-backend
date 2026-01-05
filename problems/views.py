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

    def get(self, request, **kwargs):
        code = ""
        instance = None

        print(kwargs,"GET problem called kwargs")

        if "id" in kwargs:
            instance = Problems.objects.filter(id=kwargs["id"]).first()

        elif "title" in kwargs:
            title = kwargs["title"].replace("-", " ")
            instance = Problems.objects.filter(title__iexact=title).first()

        if instance is None:
            return Response(
                {"msg": "Problem not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.is_authenticated:
            code_instance = Code.objects.filter(
                problem_id=instance.id,
                user_id=request.user.id
            ).first()

            if code_instance:
                code = code_instance.code

        serializer = ProblemSetSerailizer(instance)

        return Response(
            {
                "data": serializer.data,
                "code": code
            },
            status=status.HTTP_200_OK
        )
