from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PDFChat

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PDFChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFChat
        fields = '__all__'
