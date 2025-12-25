
from django.contrib import admin
from django.urls import path,include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',include('account.urls')),
    path('api/problems/',include('problems.urls')),
    path('api/code/',include('runcode.urls')),
    path('api/submissions/',include('submissions.urls')),
    path('api/comments/',include('comments.urls')),
    path('api/solutions/',include('solutions.urls')),
]
