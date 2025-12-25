from django.urls import path
from .views import SubmitCode,RuntimeMemoryQueries,ListOfSubmissions,PerticularSubmission


urlpatterns = [
    path('submit/',SubmitCode.as_view()),
    path('submit/note/<int:id>/',SubmitCode.as_view()),
    path('timememoryqery/',RuntimeMemoryQueries.as_view()),
    path('listofsubmissions/<int:pk>',ListOfSubmissions.as_view()),
    path('submission/<int:pk>',PerticularSubmission.as_view()),
]
