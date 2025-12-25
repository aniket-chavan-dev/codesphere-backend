from django.urls import path
from .views import CommentView,CommentLikesView

urlpatterns = [
    path('comment/',CommentView.as_view()),
    path('comment/like/',CommentLikesView.as_view()),
    path('comment/delete/<int:pk>',CommentView.as_view()),
    path('comment/update/<int:pk>',CommentView.as_view()),
]
