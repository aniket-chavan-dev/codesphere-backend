from django.urls import path
from .views import UserRagistration,UserLogin,PasswordResetRequestView,PasswordResetConfirmView,UserDetailView
urlpatterns = [
    path("user/ragister/",UserRagistration.as_view()),
    path("user/login/",UserLogin.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("user/",UserDetailView.as_view()),
]
