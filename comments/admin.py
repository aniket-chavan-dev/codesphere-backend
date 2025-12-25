from django.contrib import admin
from .models import CommentLikes,Comments


# Register your models here.
@admin.register(Comments)
class CommentsAdmin(admin.ModelAdmin):
    list_display = ['id','content']