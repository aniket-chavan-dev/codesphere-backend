from rest_framework import serializers
from .models import Comments
from account.serializer import UserSerializer
from django.contrib.contenttypes.models import ContentType
from .models import CommentLikes

class RecursiveField(serializers.Serializer):
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data


class CommentsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = RecursiveField(many=True, read_only=True)
    content_type = serializers.CharField(write_only=True, required=False)
    object_id = serializers.IntegerField(write_only=True, required=False)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comments
        fields = [
            'id', 'user', 'content', 'parent', 'likes_count',
            'created_at', 'updated_at', 'replies', 'content_type', 'object_id','is_liked',
        ]

    
    def get_is_liked(self,obj) :
        user = self.context['request'].user
        if user.is_authenticated :
            return CommentLikes.objects.filter(user_id = user.id,comment_id = obj.id).first() is not None
        return False


    def create(self, validated_data):
        model_name = validated_data.pop('model_name', None)
       
        object_id = validated_data.pop('object_id', None)
        if not model_name:
            raise serializers.ValidationError({"model_name": "This field is required."})
        try:
            ct_type = ContentType.objects.get(model=model_name.lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"content_type": "invalid content type"})
        comment = Comments.objects.create(
            content_type=ct_type,
            object_id=object_id,
            **validated_data
        )
        return comment



