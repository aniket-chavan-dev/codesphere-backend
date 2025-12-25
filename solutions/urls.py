from django.urls import path
from .views import SolutionsView,ListOfSolutions,UserSolutions

urlpatterns = [
    path('solution/',SolutionsView.as_view()),
    path('solution/<int:pk>',SolutionsView.as_view()),
    path('listSolutions/',ListOfSolutions.as_view()),
    path('listSolutions/<int:pk>',ListOfSolutions.as_view()),
    path('list/user/solutions/<int:pk>',UserSolutions.as_view()),
]
