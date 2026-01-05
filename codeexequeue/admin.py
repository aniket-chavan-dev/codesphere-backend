from django.contrib import admin
from .models import CodeQueue

@admin.register(CodeQueue)
class CodeQueueAdmin(admin.ModelAdmin):
    list_display = ['id','status', 'user_id', 'problem_id', 'created_at']