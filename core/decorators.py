from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from django.urls import reverse

TIER_ORDER = {"free": 0, "basic": 1, "standard": 2, "pro": 3}


def require_auth(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get("user_id"):
            if request.headers.get("HX-Request"):
                return HttpResponseForbidden("<p>Please log in.</p>")
            return redirect(reverse("login"))
        return view_func(request, *args, **kwargs)
    return wrapper


def require_tier(*tiers):
    """Tier checks disabled — all features available on every plan."""

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.session.get("user_id"):
                if request.headers.get("HX-Request"):
                    return HttpResponseForbidden("<p>Please log in.</p>")
                return redirect(reverse("login"))
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_role(*roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.session.get("user_id"):
                if request.headers.get("HX-Request"):
                    return HttpResponseForbidden("<p>Please log in.</p>")
                return redirect(reverse("login"))
            from core.org import get_current_org
            org = get_current_org(request)
            if not org:
                return redirect(reverse("dashboard"))
            from accounts.models import OrganizationMembership
            m = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
            role = m.role if m else "viewer"
            if role.lower() not in [r.lower() for r in roles]:
                if request.headers.get("HX-Request"):
                    return HttpResponseForbidden("<p>You don't have permission for this action.</p>")
                return HttpResponseForbidden("<p>You don't have permission for this action.</p>")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def tier_has_feature(org_tier, feature):
    """All features enabled regardless of plan."""
    return True
