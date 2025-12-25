from rest_framework import serializers
from .models import Submissions
from account.serializer import UserSerializer
from problems.serializer import ProblemSetSerailizer

class SubmissionsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    problem = ProblemSetSerailizer(read_only = True)
    class Meta:
        model = Submissions
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)