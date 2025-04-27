from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    college_name = models.CharField(max_length=255)
    year_of_joining = models.IntegerField(default=0)
    def __str__(self):
        return self.username
    

class InterviewAttempt(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="interview_attempts")
    interview_type = models.CharField(max_length=10, choices=[('Technical', 'Technical'), ('HR', 'HR')])
    date = models.DateTimeField(auto_now_add=True)

    # Six Metrics
    fluency = models.IntegerField()
    content_structure = models.IntegerField()
    accuracy = models.IntegerField()
    grammar = models.IntegerField()
    vocabulary = models.IntegerField()
    coherence = models.IntegerField()

    overall_rating = models.FloatField()

    def __str__(self):
        return f"{self.user.username} - {self.date}"
