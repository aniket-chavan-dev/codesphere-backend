from rest_framework import serializers
from .models import Solutions
from account.serializer import UserSerializer
from problems.serializer import ProblemSetSerailizer
from comments.serialzer import CommentsSerializer
from comments.models import Comments
from django.contrib.contenttypes.models import ContentType
from .models import SolutuionLike

class SolutionsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    problem = ProblemSetSerailizer(read_only=True)
    comments = serializers.SerializerMethodField()  
    is_liked = serializers.SerializerMethodField() # true when user like solution else false

    class Meta:
        model = Solutions
        fields = ['user', 'problem', 'solution_content', 'like_count', 'views_count', 'comments','created_at','title','is_liked','id']

    def get_comments(self, obj):
        
        content_type = ContentType.objects.get_for_model(Solutions)
       
        comments = Comments.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            parent=None  # only top-level comments
        ).order_by('-created_at')
        return CommentsSerializer(comments, many=True, context=self.context).data
    
    def get_is_liked(self,obj):
        user = self.context['request'].user
        if user.is_authenticated :
            return SolutuionLike.objects.filter(user_id = self.context['request'].user,solution_id = obj.id).first() is not None
        return False


      
       
    
    def create(self, validated_data):
        return super().create(validated_data)
    

