from django.contrib import admin
from .models import Submissions,PrivateTestCases
# Register your models here.


@admin.register(Submissions)
class SubmissionsAdmin(admin.ModelAdmin):
    list_display = ['id','code','status'] 

@admin.register(PrivateTestCases)
class PrivateTestCasesadmin(admin.ModelAdmin):
    list_display = ['id']
    autocomplete_fields = ['problem']