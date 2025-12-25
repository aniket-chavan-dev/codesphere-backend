from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Extra fields for Streamly
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    collage_name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username still required but login via email

    def __str__(self):
        return self.email




