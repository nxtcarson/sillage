import logging
import os

logger = logging.getLogger(__name__)


def user_profile(request):
    profile = None
    user_organizations = []
    user_id = request.session.get("user_id")
    if user_id:
        try:
            from accounts.models import UserProfile
            profile = UserProfile.objects.select_related("organization").prefetch_related("org_memberships__organization").get(id=user_id)
            user_organizations = profile.get_organizations()
        except Exception as e:
            logger.warning("Context processor user_profile lookup failed for user_id=%s: %s", user_id, e)
    return {
        "user_profile": profile,
        "user_organizations": user_organizations,
        "current_org": getattr(request, "current_org", None),
    }


def firebase_config(request):
    return {
        "firebase_api_key": os.environ.get("FIREBASE_API_KEY", ""),
        "firebase_auth_domain": os.environ.get("FIREBASE_AUTH_DOMAIN", ""),
        "firebase_project_id": os.environ.get("FIREBASE_PROJECT_ID", ""),
        "firebase_storage_bucket": os.environ.get("FIREBASE_STORAGE_BUCKET", ""),
    }
