from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models import CustomUser, InterviewAttempt

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(read_only=True)
    technical_count = serializers.SerializerMethodField()
    behavioural_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'college_name','technical_count', 'behavioural_count']

    def get_technical_count(self, obj):
        count = InterviewAttempt.objects.filter(user=obj, interview_type='Technical').count()
        print(f"Technical count for {obj.username}: {count}")
        return count

    def get_behavioural_count(self, obj):
        count = InterviewAttempt.objects.filter(user=obj, interview_type='Behavioural').count()
        print(f"HR count for {obj.username}: {count}")
        return count


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
    

# User = get_user_model()

