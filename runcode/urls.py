from django.urls import path
from .views import RunPublicTestCases

urlpatterns = [
    path("run/",RunPublicTestCases.as_view())
]
