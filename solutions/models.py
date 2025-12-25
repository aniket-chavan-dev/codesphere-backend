from django.db import models
from account.models import User
from problems.models import Problems

class Solutions(models.Model):
    title = models.CharField(max_length=400,null=True,blank=True)
    problem = models.ForeignKey(Problems,on_delete=models.CASCADE,related_name="solutions")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="solutions")
    solution_content = models.TextField(null=True,blank=True)
    like_count = models.BigIntegerField(default=0)
    views_count = models.BigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"solution of user {self.user.email}"
    
class SolutuionLike(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="sol_likes")
    solution = models.ForeignKey(Solutions,on_delete=models.CASCADE,related_name="sol_likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta :
        unique_together = ('user','solution') # user like only once for any solution

    def __str__(self):
        return f"user {self.user.email} like this solution"
