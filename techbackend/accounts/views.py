from rest_framework import authentication,permissions,serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from .models import InterviewAttempt
User = get_user_model()
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message" : "User created successfully",
                "status" : True,
                "data" : serializer.data
            },status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token" : str(refresh.access_token),
                "refresh_token" : str(refresh),
            })
        return Response({"message" : "Invalid credentials"},status=status.HTTP_400_BAD_REQUEST)
            


class ProfileView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = RegisterSerializer(user)
        return Response(serializer.data)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("Request headers:", request.headers)
        print("Request body:", request.body)
        print("Requested data:", request.data)
        
        try:
            refresh_token = request.data.get("refresh")
            print("Extracted refresh token:", refresh_token)
            
            if not refresh_token:
                return Response({"message": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to validate the token before blacklisting
            try:
                # Add token validation check here if possible
                print("About to blacklist token...")
                token = RefreshToken(refresh_token)
                token.blacklist()
                print("Token successfully blacklisted")
                return Response(status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                print(f"Token processing error: {str(e)}")
                raise e
                
        except TokenError as e:
            print(f"Logout TokenError: {str(e)}")
            return Response({"message": f"Invalid or expired token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Logout error: {str(e)}")
            return Response({"message": f"Invalid credentials: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']  # Add other fields you need

# views.py
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer  # ✅ Use the new serializer
    
    def get_object(self):
        return self.request.user
    




