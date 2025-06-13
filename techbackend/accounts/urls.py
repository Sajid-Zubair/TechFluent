from django.urls import path
from .views import save_rating, latest_attempt, user_rank_view, get_interview_progress,current_streak

urlpatterns = [
    path('save_rating/', save_rating, name='save_rating'),
    path('latest_attempt/', latest_attempt, name='latest_attempt'),
    path('user_rank/', user_rank_view, name='user_rank'),
    path('get_interview_progress/', get_interview_progress, name='get_interview_progress'),
    path('current_streak/', current_streak, name='current_streak'),
]