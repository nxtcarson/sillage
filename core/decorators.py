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
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.session.get("user_id"):
                if request.headers.get("HX-Request"):
                    return HttpResponseForbidden("<p>Please log in.</p>")
                return redirect(reverse("login"))
            org_tier = getattr(request, "org_tier", "free") or "free"
            if org_tier.lower() not in [t.lower() for t in tiers]:
                if request.headers.get("HX-Request"):
                    return HttpResponseForbidden("<p>This feature requires a higher plan.</p>")
                return redirect(reverse("pricing"))
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
    tier_level = TIER_ORDER.get((org_tier or "free").lower(), 0)
    feature_tiers = {
        "calendar": ["standard", "pro"],
        "time_tracking": ["pro"],
        "private_boards": ["pro"],
        "automations": ["standard", "pro"],
        "priority_support": ["basic", "standard", "pro"],
    }
    required = feature_tiers.get(feature, [])
    return any(tier_level >= TIER_ORDER.get(t, 0) for t in required)
