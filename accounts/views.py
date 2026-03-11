import logging
import re
import uuid
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from core.decorators import require_auth
from core.firebase import get_firebase_app, verify_id_token
from .models import UserProfile, Organization, OrganizationMembership

logger = logging.getLogger(__name__)


def _slugify(name):
    base = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-") or "org"
    return f"{base}-{uuid.uuid4().hex[:8]}"


@require_http_methods(["GET"])
def login_page(request):
    return render(request, "auth/login.html")


@require_http_methods(["GET"])
def signup_page(request):
    return render(request, "auth/signup.html")


@require_http_methods(["GET"])
def finish_sign_in_page(request):
    return render(request, "auth/finish_sign_in.html")


@require_POST
def firebase_login(request):
    try:
        token = request.POST.get("id_token") or request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            logger.warning("Firebase login attempted without token")
            return JsonResponse({"ok": False, "error": "No token provided"}, status=400)
        if get_firebase_app() is None:
            logger.error("Firebase login failed: Firebase Admin not configured")
            return JsonResponse({"ok": False, "error": "Firebase Admin not configured. Add FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL to .env (see .env.example)."}, status=503)
        decoded = verify_id_token(token)
        if not decoded:
            logger.warning("Firebase login failed: invalid token")
            return JsonResponse({"ok": False, "error": "Invalid token"}, status=401)
        uid = decoded.get("uid")
        email = decoded.get("email", "")
        name = decoded.get("name", "")
        try:
            profile = UserProfile.objects.select_related("organization").get(firebase_uid=uid)
        except UserProfile.DoesNotExist:
            org = Organization.objects.create(
                name=f"{name or email}'s Company",
                slug=_slugify(email or uid),
            )
            profile = UserProfile.objects.create(
                firebase_uid=uid,
                organization=org,
                email=email,
                name=name or email,
                role="owner",
            )
            OrganizationMembership.objects.create(user=profile, organization=org, role="owner", is_primary=True)
        org = profile.get_primary_organization()
        if not org:
            org = profile.organization
        request.session["user_id"] = profile.id
        request.session["org_id"] = org.id if org else None
        request.session["org_tier"] = org.tier if org else "free"
        return JsonResponse({"ok": True, "redirect": "/dashboard/"})
    except Exception as e:
        logger.exception("Firebase login unexpected error")
        return JsonResponse({"ok": False, "error": str(e)}, status=500)


@require_POST
def firebase_signup(request):
    return firebase_login(request)


def logout_view(request):
    request.session.flush()
    return redirect("landing")


@require_auth
@require_POST
def switch_org(request):
    org_id = request.POST.get("org_id")
    if not org_id:
        return redirect(request.META.get("HTTP_REFERER", "/dashboard/"))
    profile = request.user_profile
    orgs = profile.get_organizations()
    if not orgs and profile.organization_id:
        orgs = [profile.organization]
    if any(int(org_id) == o.id for o in orgs):
        request.session["org_id"] = int(org_id)
        from accounts.models import Organization
        org = Organization.objects.get(id=org_id)
        request.session["org_tier"] = org.tier
    return redirect(request.META.get("HTTP_REFERER", "/dashboard/"))


@require_http_methods(["GET", "POST"])
@require_auth
def create_org_page(request):
    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        if not name:
            return render(request, "accounts/create_org.html", {"error": "Enter a company name."})
        profile = request.user_profile
        org = Organization.objects.create(name=name, slug=_slugify(name))
        OrganizationMembership.objects.create(user=profile, organization=org, role="owner", is_primary=False)
        if not profile.organization_id:
            profile.organization = org
            profile.save()
            OrganizationMembership.objects.filter(user=profile, organization=org).update(is_primary=True)
        request.session["org_id"] = org.id
        request.session["org_tier"] = org.tier
        return redirect("dashboard")
    return render(request, "accounts/create_org.html")
