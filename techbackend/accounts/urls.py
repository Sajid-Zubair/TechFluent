from django.urls import path
from .views import save_rating, latest_attempt

urlpatterns = [
    path('save_rating/', save_rating, name='save_rating'),
    path('latest_attempt/', latest_attempt, name='latest_attempt'),
]