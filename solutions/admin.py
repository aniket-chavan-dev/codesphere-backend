from django.contrib import admin
from .models import Solutions

# Register your models here.
@admin.register(Solutions)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ['id','user']