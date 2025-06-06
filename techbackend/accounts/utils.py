from django.db.models import OuterRef, Subquery
from django.db.models.functions import Rank
from django.db.models import F, Window
from .models import CustomUser, InterviewAttempt

def get_user_rank(user):
    latest_attempt_subquery = InterviewAttempt.objects.filter(
        user=OuterRef('pk')
    ).order_by('-id')  # Using 'id' to get latest attempt

    college_users = CustomUser.objects.filter(college_name=user.college_name).annotate(
        latest_overall_rating=Subquery(latest_attempt_subquery.values('overall_rating')[:1])
    )

    college_users_with_rank = college_users.annotate(
        rank=Window(
            expression=Rank(),
            order_by=F('latest_overall_rating').desc(nulls_last=True)
        )
    )

    for u in college_users_with_rank:
        if u.id == user.id:
            return {
                "rank": u.rank,
                "latest_rating": round(u.latest_overall_rating or 0, 2),
                "college": u.college_name,
                "total_users": college_users.count(),
            }

    return {
        "rank": None,
        "latest_rating": 0,
        "college": user.college_name,
    }