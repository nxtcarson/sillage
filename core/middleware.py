import logging
from django.http import HttpResponseRedirect
from django.urls import reverse

logger = logging.getLogger(__name__)
PUBLIC_PATHS = ["/", "/login/", "/signup/", "/pricing/", "/auth/login/", "/auth/signup/", "/auth/finish-sign-in/", "/billing/webhook/", "/invite"]


class PopupAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path in ("/auth/login/", "/auth/signup/", "/auth/finish-sign-in/"):
            response["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
        return response


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
                from accounts.models import UserProfile, Organization
                profile = UserProfile.objects.select_related("organization").prefetch_related("org_memberships__organization").get(id=request.session["user_id"])
                request.user_profile = profile
                org_id = request.session.get("org_id")
                org = None
                if org_id:
                    try:
                        cand = Organization.objects.get(id=org_id)
                        is_member = profile.organization_id == cand.id or any(m.organization_id == cand.id for m in profile.org_memberships.all())
                        if is_member:
                            org = cand
                    except Organization.DoesNotExist:
                        pass
                if not org:
                    org = profile.get_primary_organization() or profile.organization
                request.current_org = org
                request.org_tier = org.tier if org else "free"
            except Exception as e:
                logger.warning("Session user lookup failed for user_id=%s: %s", request.session.get("user_id"), e)
            return self.get_response(request)
        return HttpResponseRedirect(reverse("login"))
