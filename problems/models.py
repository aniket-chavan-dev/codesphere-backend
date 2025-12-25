from django.db import models
from account.models import User
# Create your models here.

class Problems(models.Model):
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True,null=True)
    difficulty = models.CharField(max_length=20)
    acceptance_rate = models.FloatField(default=0.0)
    discuss_count = models.BigIntegerField(default=0)
    submissions_count = models.BigIntegerField(default=0)
    acceptance_count = models.BigIntegerField(default=0)
    related_topics = models.TextField(blank=True,null=True)
    likes = models.BigIntegerField(default=0)
    dislikes = models.BigIntegerField(default=0)
    rating = models.FloatField(default=0)
    similar_questions = models.TextField(blank=True,null=True)
    category = models.CharField(max_length=300,blank=True,null=True)
    companies = models.TextField(blank=True,null=True)
    def __str__(self):
        return self.title
    

class Tag(models.Model) :
    name = models.CharField(max_length=300)
    problem = models.ForeignKey(Problems,on_delete=models.CASCADE,related_name="tags")

    def __str__(self):
        return self.name