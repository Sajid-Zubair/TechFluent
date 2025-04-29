from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model


User = get_user_model()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    re_password = serializers.CharField(required=True, write_only=True)
    college_name = serializers.CharField(required=True)
    year_of_joining = serializers.IntegerField(required=True)
    
    def validate(self, data):
        if data['password'] != data['re_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if username already exists
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        
            
        return data
    
    def create(self, validated_data):
        # Remove password2 before creating user
        validated_data.pop('re_password')
        
        # Create user with all fields
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            college_name=validated_data['college_name'],
            year_of_joining=validated_data['year_of_joining']
        )
        return user
    
    def to_representation(self, instance):
        # Control what data is returned after user creation
        return {
            'username': instance.username,
            'email': instance.email,
            'college_name': instance.college_name,
            'year_of_joining': instance.year_of_joining
        }
    
