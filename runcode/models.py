from django.db import models
from account.models import User
from problems.models import Problems

# Create your models here.
class HeplperFunctions(models.Model):
    linked_list_helper_function = models.TextField(blank=True,null=True)
    trees_helper_functions = models.TextField(blank=True,null=True)

class Code(models.Model):
    code = models.TextField(null=True,blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="codes")
    problem = models.ForeignKey(Problems,on_delete=models.CASCADE,related_name='codes')
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)