from django.contrib import admin
from .models import CustomUser, InterviewAttempt
# Register your models here.
admin.site.register(CustomUser)



@admin.register(InterviewAttempt)
class InterviewAttemptAdmin(admin.ModelAdmin):
    list_display = (
        'user', 
        'interview_type', 
        'date', 
        'fluency', 
        'content_structure', 
        'accuracy', 
        'grammar', 
        'vocabulary', 
        'coherence', 
        'overall_rating'
    )
    list_filter = ('interview_type', 'date', 'user__college_name')
    search_fields = ('user__username',)
