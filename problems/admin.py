from django.contrib import admin
from .models import Problems,Tag

# Register your models here.
@admin.register(Problems)
class problemAdmin(admin.ModelAdmin):
    list_display = ['id','title']
    search_fields = ['title','id']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['id','name']