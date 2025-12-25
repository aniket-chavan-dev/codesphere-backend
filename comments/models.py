from django.db import models
from account.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Comments(models.Model):
    content = models.TextField(blank=True,null=True,default="")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='comments')
    parent = models.ForeignKey('self',on_delete=models.CASCADE,null=True,blank=True,related_name='replies')
    likes_count = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    #generic foreign key for Solutions and Discussions models
    content_type = models.ForeignKey(ContentType,on_delete=models.CASCADE,null=True,blank=True)
    object_id = models.BigIntegerField(null=True,blank=True)
    content_object = GenericForeignKey('content_type','object_id')

    class Meta :
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return f"content {self.content} user {self.user.first_name}"
    
class CommentLikes(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="likes")
    comment = models.ForeignKey(Comments,on_delete=models.CASCADE,related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','comment') # user like only once for any comment

    def __str__(self):
        return f"user like {self.user.first_name} of this comment id {self.comment.id}"