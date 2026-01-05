from django.db import models

# Create your models here.

class CodeQueue(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    code = models.TextField()
    user_id = models.IntegerField()
    problem_id = models.IntegerField()
    status = models.CharField(max_length=50, default='pending',choices=STATUS_CHOICES)
    code_attr = models.JSONField(null=True,blank=True)  # e.g., pending, running, completed, failed
    output = models.TextField(blank=True, null=True)
    error = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    test_cases = models.JSONField(blank=True, null=True)


    def __str__(self):
        return f"CodeQueue(id={self.id}, user_id={self.user_id}, problem_id={self.problem_id}, status={self.status})"
