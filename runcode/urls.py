from django.urls import path
from .views import RunPublicTestCases

urlpatterns = [
    path("run/",RunPublicTestCases.as_view()),
    path("run/<int:id>/",RunPublicTestCases.as_view()),
]
