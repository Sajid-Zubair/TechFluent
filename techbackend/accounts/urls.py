from django.urls import path
from .views import save_rating, latest_attempt, user_rank_view

urlpatterns = [
    path('save_rating/', save_rating, name='save_rating'),
    path('latest_attempt/', latest_attempt, name='latest_attempt'),
    path('user_rank/', user_rank_view, name='user_rank'),
]