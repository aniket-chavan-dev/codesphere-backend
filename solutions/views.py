
from rest_framework import status
from rest_framework.response import Response
from .models import Solutions
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from .serializer import SolutionsSerializer
from problems.models import Problems
from rest_framework.generics import ListAPIView
from .pagination import CustomPagination

class SolutionsView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self,req,pk = None):
        if req.method == "GET":
            if pk is not None:
                solution_instance = Solutions.objects.filter(id = pk).first()
                if solution_instance is not None:
                    solution_instance.views_count += 1
                    solution_instance.save()
                    serializer = SolutionsSerializer(solution_instance,context={'request': req})
                    return Response(serializer.data,status=status.HTTP_200_OK)
                return Response({'msg' : 'solution not found'},status=status.HTTP_404_NOT_FOUND)
            return Response({'msg' : 'solution id not given'},status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
    
    def post(self,req):
        if req.method == "POST":
            serializer = SolutionsSerializer(data = req.data,context = {'user' : req.user})
            if serializer.is_valid():
                pro_instance = Problems.objects.get(id = req.data['problem_id'])
                sol_instance = serializer.save(user = req.user,problem = pro_instance)
                return Response({'msg' : 'solution created successfully'},status=status.HTTP_201_CREATED)
            else :
                print(serializer.errors)
                return Response(serializer.errors,status=status.HTTP_409_CONFLICT)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
    

class ListOfSolutions(ListAPIView):
    serializer_class = SolutionsSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        # access pk value from url
        pk = self.kwargs.get('pk')
        if pk is not None:
            return Solutions.objects.filter(problem_id = pk).order_by('created_at')
        return Solutions.objects.all()

class UserSolutions(ListAPIView) :
    serializer_class = SolutionsSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # access pk value from URL
        pk = self.kwargs.get('pk')
        user = self.request.user  # ✅ correct way to access current user
        
        if pk is not None:
            return Solutions.objects.filter(
                problem_id=pk,
                user_id=user.id
            ).order_by('created_at')
        
        return Solutions.objects.filter(user_id=user.id).order_by('created_at')