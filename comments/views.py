from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import CommentLikes,Comments
from .serialzer import CommentsSerializer
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly



# Create your views here.

class CommentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,req):
        if req.method == "POST":
            data = req.data
            print(data)
            serializer = CommentsSerializer(data = data,context = {'request' : req})
            if serializer.is_valid():
                comment_instance = serializer.save(
                    user = req.user,
                    model_name = data['model_name']
                )
                com_serializer = CommentsSerializer(comment_instance, context={'request': req})
                return Response(com_serializer.data,status=status.HTTP_201_CREATED)
            else :
                return Response(serializer.errors,status=status.HTTP_424_FAILED_DEPENDENCY)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,req,pk = None):
        if req.method == "PUT":
            if pk is not None:
                comment_instance = Comments.objects.filter(id = pk).first()
                if comment_instance is not None:
                    comment_instance.content = req.data['content']
                    comment_instance.save(update_fields=['content'])
                    serializer = CommentsSerializer(comment_instance,context = {'request' : req})
                    return Response(serializer.data,status=status.HTTP_200_OK)
                return Response({'msg' : 'comment not found'},status=status.HTTP_404_NOT_FOUND)
            return Response({'msg' : 'comment id field is required'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,req,pk = None):
        if req.method == "DELETE":
            if pk is not None:
                Comments.objects.get(id = pk).delete()
                return Response({'msg' : "delete successfully"},status=status.HTTP_200_OK)
            return Response({'msg' : 'comment id field is required'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)


class CommentLikesView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def post(self,req):
        if req.method == "POST":
            id = req.data['id']
            comment_instance = Comments.objects.filter(id = id).first()
            if comment_instance is not None :
                like_ins,created = CommentLikes.objects.get_or_create(user = req.user,comment = comment_instance)
                if created :
                    comment_instance.likes_count += 1
                    comment_instance.save(update_fields=['likes_count'])
                    return Response(status=status.HTTP_201_CREATED)
                else :
                    like_ins.delete()
                    comment_instance.likes_count -= 1
                    comment_instance.save(update_fields=['likes_count'])
                    return Response({'msg' : 'like cancel'},status=status.HTTP_200_OK)
            else :
                return Response({'msg' : 'comment not found'},status=status.HTTP_404_NOT_FOUND)
        return Response({'msg' : 'method not allowed'},status=status.HTTP_400_BAD_REQUEST)
