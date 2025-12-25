from django.contrib import admin
from .models import HeplperFunctions,Code
# Register your models here.
@admin.register(HeplperFunctions)
class HelperFunctionAdmin(admin.ModelAdmin):
    list_display = ['id']

@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = ['id','code']