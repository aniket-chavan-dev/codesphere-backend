from django.db import models
from problems.models import Problems
from account.models import User


class Submissions(models.Model):
    STATUS_CHOICES = (
        ('Accepted','Accepted'),
        ('Runtime Error','Runtime Error'),
        ('Wrong Answer','Wrong Answer'),
        ('Compilation Error','Compilation Error'),
        ('Time Limit Exceed','Time Limit Exceed')
    )
    SUB_INDICATER_CHOICE = (
        ("pink","pink"),
        ("green","green"),
        ("blue","blue"),
        ("red","red"),
        ("yellow","yellow"),
        ("white","white")
    )
    status = models.CharField(choices=STATUS_CHOICES,max_length=25)
    problem = models.ForeignKey(Problems,on_delete=models.CASCADE,related_name="submissions")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="submissions")
    lang = models.CharField(max_length=50)
    code = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now=True)
    execution_time = models.FloatField(default=0)
    memory_use = models.FloatField(default=0)
    note = models.TextField(blank=True,null = True,default="")
    sub_indicater = models.CharField(max_length=6,choices=SUB_INDICATER_CHOICE,default="blue")
    last_executed_input = models.JSONField(blank=True,null=True,default=list)
    error_message = models.TextField(blank=True,null=True,default="")
    total_test_cases = models.IntegerField(default=0)
    passed_test_cases = models.IntegerField(default=0)
    user_output = models.TextField(blank=True,null=True,default="")
    histogram_data = models.JSONField(blank=True,null=True,default=dict)
   

class PrivateTestCases(models.Model):
    private_test_cases = models.JSONField(blank=True,null=True)
    problem = models.ForeignKey(Problems,on_delete=models.CASCADE,related_name="test_cases")
    code_solution = models.TextField(blank=True,null=True)