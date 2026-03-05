from django.http import HttpResponseRedirect
from django.urls import reverse
from .firebase import verify_id_token

PUBLIC_PATHS = ["/", "/login/", "/signup/", "/pricing/", "/auth/login/", "/auth/signup/", "/billing/webhook/"]


def _is_public(path):
    for p in PUBLIC_PATHS:
        if not p:
            continue
        base = p.rstrip("/") or "/"
        if path == base or (base != "/" and path.startswith(base + "/")):
            return True
    return False


class FirebaseAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if _is_public(request.path):
            return self.get_response(request)
        if request.path.startswith("/static/") or request.path.startswith("/admin/"):
            return self.get_response(request)
        if request.session.get("user_id"):
            try:
                from accounts.models import UserProfile
                profile = UserProfile.objects.select_related("organization").get(id=request.session["user_id"])
                request.user_profile = profile
                request.org_tier = profile.organization.tier
            except Exception:
                pass
            return self.get_response(request)
        token = request.headers.get("Authorization", "").replace("Bearer ", "") or request.POST.get("id_token") or request.GET.get("id_token")
        if token:
            decoded = verify_id_token(token)
            if decoded:
                request.firebase_user = decoded
                return self.get_response(request)
        return HttpResponseRedirect(reverse("login"))
