from django.db.models import Avg, Window, F
from django.db.models.functions import Rank
from .models import CustomUser, InterviewAttempt

def get_user_rank(user):
    # Step 1: Filter all users in the same college
    college_users = CustomUser.objects.filter(college_name=user.college_name)

    # Step 2: Annotate each user with their average interview rating
    college_users_with_avg = college_users.annotate(
        avg_rating=Avg('interview_attempts__overall_rating')
    ).annotate(
        rank=Window(
            expression=Rank(),
            order_by=F('avg_rating').desc()
        )
    )

    # Step 3: Find and return the current user's rank
    for u in college_users_with_avg:
        if u.id == user.id:
            return {
                "rank": u.rank,
                "average_rating": round(u.avg_rating or 0, 2),
                "college": u.college_name,
                "total_users": college_users.count(),
            }

    return {
        "rank": None,
        "average_rating": 0,
        "college": user.college_name,
    }