from django.urls import path
from . import views

urlpatterns = [
    path('get_question/', views.get_question, name='get_question'),
    path('process_audio/', views.process_audio, name='process_audio'),
    path('get_answer/', views.get_answer, name='get_answer'),
    path('jobs/', views.job_search, name='jobs'),
]