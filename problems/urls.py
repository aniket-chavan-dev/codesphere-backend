from django.urls import path
from .views import GetProblemSet,GetProblem

urlpatterns = [
    path('problemset/',GetProblemSet.as_view()),
    path('problem/<int:id>',GetProblem.as_view()),
    path('problem/bytitle/<str:title>',GetProblem.as_view())
]
