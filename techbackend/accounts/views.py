from rest_framework import authentication,permissions,serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from .models import InterviewAttempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes
from .utils import get_user_rank
from datetime import timedelta
from django.utils.timezone import now
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

import json
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
        print("User from request:", user)
        print("College Name:", user.college_name)
        serializer = UserSerializer(user)
        print("Serialized data:", serializer.data)
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
    technical_count = serializers.SerializerMethodField()
    behavioural_count = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username', 'email','college_name','technical_count', 'behavioural_count']  # Add other fields you need

    def get_technical_count(self, obj):
        count = InterviewAttempt.objects.filter(user=obj, interview_type='Technical').count()
        print(f"Technical count for {obj.username}: {count}")
        return count

    def get_behavioural_count(self, obj):
        count = InterviewAttempt.objects.filter(user=obj, interview_type='Behavioural').count()
        print(f"HR count for {obj.username}: {count}")
        return count

# views.py
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer  # ✅ Use the new serializer
    
    def get_object(self):
        return self.request.user
    

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def save_rating(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user
            interview_type = data.get('interview_type')

            normalized = data.get('normalized_ratings', {})
            overall = data.get('overall_rating')

            # Validate all required metrics are present
            required_metrics = ['fluency', 'content_structure', 'accuracy', 'grammar', 'vocabulary', 'coherence']
            for metric in required_metrics:
                if metric not in normalized:
                    return JsonResponse({'error': f'Missing metric: {metric}'}, status=400)

            attempt = InterviewAttempt.objects.create(
                user=user,
                interview_type=interview_type,
                fluency=int(round(normalized['fluency'])),
                content_structure=int(round(normalized['content_structure'])),
                accuracy=int(round(normalized['accuracy'])),
                grammar=int(round(normalized['grammar'])),
                vocabulary=int(round(normalized['vocabulary'])),
                coherence=int(round(normalized['coherence'])),
                overall_rating=float(overall)
            )
            return JsonResponse({'status': 'success', 'id': attempt.id})

        except Exception as e:
            print("Error saving rating:", str(e))
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_attempt(request):
    user = request.user
    latest = InterviewAttempt.objects.filter(user=user).order_by('-date').first()
    
    if latest:
        data = {
            "fluency": latest.fluency,
            "content_structure": latest.content_structure,
            "accuracy": latest.accuracy,
            "grammar": latest.grammar,
            "vocabulary": latest.vocabulary,
            "coherence": latest.coherence,
            "overall_rating": latest.overall_rating,
        }
        return Response(data)
    else:
        return Response({"message": "No interview attempts found."}, status=404)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_rank_view(request):
    rank_info = get_user_rank(request.user)
    return Response(rank_info)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_progress(request):
    user = request.user
    attempts = InterviewAttempt.objects.filter(user=user).order_by('date')

    history = [
        {
            "date": attempt.date.strftime("%Y-%m-%d"),
            "fluency": attempt.fluency,
            "content_structure": attempt.content_structure,
            "accuracy": attempt.accuracy,
            "grammar": attempt.grammar,
            "vocabulary": attempt.vocabulary,
            "coherence": attempt.coherence,
            "overall": attempt.overall_rating
        }
        for attempt in attempts
    ]
    return Response(history)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_streak(request):
    user = request.user
    today = now().date()

    # assuming InterviewAttempt model with 'date' field (date or datetime)
    answer_dates = list(
        InterviewAttempt.objects
        .filter(user=user)
        .dates('date', 'day', order='DESC')
    )

    # Calculate current streak
    current_streak = 0
    for i, date in enumerate(answer_dates):
        if date == today - timedelta(days=current_streak):
            current_streak += 1
        else:
            break

    # Calculate max streak
    max_streak = 0
    temp_streak = 1

    for i in range(1, len(answer_dates)):
        if answer_dates[i] == answer_dates[i-1] - timedelta(days=1):
            temp_streak += 1
        else:
            max_streak = max(max_streak, temp_streak)
            temp_streak = 1
    max_streak = max(max_streak, temp_streak) if answer_dates else 0

    print(f"current_streak: {current_streak}, max_streak: {max_streak}")  # debug print

    # Make sure they are ints
    current_streak = int(current_streak)
    max_streak = int(max_streak)

    return Response({
        'current_streak': current_streak,
        'max_streak': max_streak,
    })