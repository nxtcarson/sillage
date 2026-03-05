from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from core.firebase import verify_id_token
from .models import UserProfile, Organization
import re


def _slugify(name):
    base = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-") or "org"
    return f"{base}-{uuid.uuid4().hex[:8]}"


@require_http_methods(["GET"])
def login_page(request):
    return render(request, "auth/login.html")


@require_http_methods(["GET"])
def signup_page(request):
    return render(request, "auth/signup.html")


@require_POST
def firebase_login(request):
    token = request.POST.get("id_token") or request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return JsonResponse({"ok": False, "error": "No token provided"}, status=400)
    decoded = verify_id_token(token)
    if not decoded:
        return JsonResponse({"ok": False, "error": "Invalid token"}, status=401)
    uid = decoded.get("uid")
    email = decoded.get("email", "")
    name = decoded.get("name", "")
    try:
        profile = UserProfile.objects.select_related("organization").get(firebase_uid=uid)
    except UserProfile.DoesNotExist:
        org = Organization.objects.create(
            name=f"{name or email}'s Organization",
            slug=_slugify(email or uid),
        )
        profile = UserProfile.objects.create(
            firebase_uid=uid,
            organization=org,
            email=email,
            name=name or email,
            role="owner",
        )
    request.session["user_id"] = profile.id
    request.session["org_id"] = profile.organization_id
    request.session["org_tier"] = profile.organization.tier
    return JsonResponse({"ok": True, "redirect": "/dashboard/"})


@require_POST
def firebase_signup(request):
    return firebase_login(request)


def logout_view(request):
    request.session.flush()
    return redirect("landing")
