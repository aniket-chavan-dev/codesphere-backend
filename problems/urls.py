from django.urls import path
from .views import GetProblemSet,GetProblem

urlpatterns = [
    path('problemset/',GetProblemSet.as_view()),
    path('problem/<str:title>',GetProblem.as_view())
]
