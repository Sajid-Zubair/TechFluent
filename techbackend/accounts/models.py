from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    # Extra fields
    college_name = models.CharField(max_length=100)
    year_of_joining = models.CharField(max_length=100)

    # Interview tracking
    technical_interviews = models.PositiveIntegerField(default=0)
    behavioral_interviews = models.PositiveIntegerField(default=0)
    total_interviews = models.PositiveIntegerField(default=0)
    overall_rating = models.FloatField(default=0.0)

    # Individual ratings
    fluency = models.FloatField(default=0.0)
    coherence = models.FloatField(default=0.0)
    accuracy = models.FloatField(default=0.0)
    grammar = models.FloatField(default=0.0)

    def __str__(self):
        return self.username
