import logging
import re
import secrets
import uuid
from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST, require_http_methods
from core.decorators import require_auth
from core.org import get_current_org
from .models import UserProfile, Organization, OrganizationMembership, Invitation

logger = logging.getLogger(__name__)


def _slugify(name):
    base = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-") or "org"
    return f"{base}-{uuid.uuid4().hex[:8]}"


def _set_session_for_profile(request, profile):
    org = profile.get_primary_organization() or profile.organization
    request.session["user_id"] = profile.id
    request.session["org_id"] = org.id if org else None
    request.session["org_tier"] = org.tier if org else "free"


@require_http_methods(["GET", "POST"])
def login_page(request):
    if request.session.get("user_id"):
        return redirect("dashboard")
    if request.method == "POST":
        email = (request.POST.get("email") or "").strip().lower()
        password = request.POST.get("password") or ""
        if not email or not password:
            return render(request, "auth/login.html", {
                "error": "Enter email and password.",
                "next": request.GET.get("next", "") or request.POST.get("next", ""),
            })
        profile = UserProfile.objects.select_related("organization").filter(email__iexact=email).first()
        if not profile or not check_password(password, profile.password):
            return render(request, "auth/login.html", {
                "error": "Invalid email or password.",
                "next": request.GET.get("next", "") or request.POST.get("next", ""),
            })
        _set_session_for_profile(request, profile)
        nxt = (request.GET.get("next") or request.POST.get("next") or "").strip()
        if nxt.startswith("/"):
            return redirect(nxt)
        if request.session.get("pending_invite_token"):
            return redirect("invite_accept", token=request.session["pending_invite_token"])
        return redirect("dashboard")
    return render(request, "auth/login.html", {"next": request.GET.get("next", "")})


@require_http_methods(["GET", "POST"])
def signup_page(request):
    if request.session.get("user_id"):
        return redirect("dashboard")
    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        email = (request.POST.get("email") or "").strip().lower()
        password = request.POST.get("password") or ""
        if not email or not password:
            return render(request, "auth/signup.html", {"error": "Email and password are required."})
        if len(password) < 8:
            return render(request, "auth/signup.html", {"error": "Password must be at least 8 characters."})
        if UserProfile.objects.filter(email__iexact=email).exists():
            return render(request, "auth/signup.html", {"error": "An account with this email already exists."})
        org = Organization.objects.create(
            name=f"{name or email}'s Company",
            slug=_slugify(email or "user"),
        )
        profile = UserProfile.objects.create(
            organization=org,
            email=email,
            name=name or email,
            role="owner",
            password=make_password(password),
        )
        OrganizationMembership.objects.create(user=profile, organization=org, role="owner", is_primary=True)
        _set_session_for_profile(request, profile)
        return redirect("dashboard")
    return render(request, "auth/signup.html")


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


@require_auth
def team_settings(request):
    org = get_current_org(request)
    if not org:
        return redirect("dashboard")
    memberships = OrganizationMembership.objects.filter(organization=org).select_related("user").order_by("-role")
    pending = Invitation.objects.filter(organization=org, accepted_at__isnull=True, expires_at__gt=timezone.now()).select_related("invited_by").order_by("-created_at")
    user_membership = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
    return render(request, "accounts/team_settings.html", {"memberships": memberships, "pending_invites": pending, "user_membership": user_membership})


@require_auth
@require_POST
def invite_create(request):
    org = get_current_org(request)
    if not org:
        return redirect("dashboard")
    role = request.POST.get("role", "agent")
    if role not in ("owner", "admin", "agent", "viewer"):
        role = "agent"
    token = secrets.token_urlsafe(32)
    expires_at = timezone.now() + timedelta(days=7)
    inv = Invitation.objects.create(
        organization=org,
        email=request.POST.get("email", "").strip(),
        role=role,
        token=token,
        invited_by=request.user_profile,
        expires_at=expires_at,
    )
    invite_url = request.build_absolute_uri(f"/invite/{token}/")
    user_membership = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
    return render(request, "accounts/team_settings.html", {
        "memberships": OrganizationMembership.objects.filter(organization=org).select_related("user").order_by("-role"),
        "pending_invites": Invitation.objects.filter(organization=org, accepted_at__isnull=True, expires_at__gt=timezone.now()).select_related("invited_by").order_by("-created_at"),
        "user_membership": user_membership,
        "new_invite_url": invite_url,
    })


@require_http_methods(["GET", "POST"])
def invite_accept(request, token):
    inv = get_object_or_404(Invitation, token=token)
    if not inv.is_valid:
        return render(request, "accounts/invite_accept.html", {"invitation": inv, "expired": True})
    if not request.session.get("user_id"):
        request.session["pending_invite_token"] = token
        return redirect(f"/login/?next=/invite/{token}/")
    profile = UserProfile.objects.get(id=request.session["user_id"])
    if request.method == "POST":
        OrganizationMembership.objects.get_or_create(
            user=profile,
            organization=inv.organization,
            defaults={"role": inv.role, "is_primary": False},
        )
        inv.accepted_at = timezone.now()
        inv.save(update_fields=["accepted_at"])
        request.session.pop("pending_invite_token", None)
        request.session["org_id"] = inv.organization_id
        request.session["org_tier"] = inv.organization.tier
        return redirect("dashboard")
    return render(request, "accounts/invite_accept.html", {"invitation": inv, "expired": False})


@require_http_methods(["GET", "POST"])
@require_auth
def profile_settings(request):
    profile = request.user_profile
    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        profile.name = name
        avatar = (request.POST.get("avatar_url") or "").strip()
        if avatar:
            profile.avatar_url = avatar
        profile.save()
        return redirect("profile_settings")
    return render(request, "accounts/profile_settings.html")


@require_http_methods(["GET", "POST"])
@require_auth
def org_settings(request):
    org = get_current_org(request)
    if not org:
        return redirect("dashboard")
    membership = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
    if not membership or membership.role not in ("owner", "admin"):
        return redirect("dashboard")
    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        if name:
            org.name = name
            org.save()
        return redirect("org_settings")
    return render(request, "accounts/org_settings.html", {"org": org})


@require_auth
@require_POST
def member_change_role(request, membership_id):
    org = get_current_org(request)
    if not org:
        return redirect("dashboard")
    membership = get_object_or_404(OrganizationMembership, id=membership_id, organization=org)
    my_membership = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
    if not my_membership or my_membership.role not in ("owner", "admin"):
        return redirect("team_settings")
    if membership.role == "owner":
        return redirect("team_settings")
    role = request.POST.get("role")
    if role in ("admin", "agent", "viewer"):
        membership.role = role
        membership.save()
    return redirect("team_settings")


@require_auth
@require_POST
def member_remove(request, membership_id):
    org = get_current_org(request)
    if not org:
        return redirect("dashboard")
    membership = get_object_or_404(OrganizationMembership, id=membership_id, organization=org)
    my_membership = OrganizationMembership.objects.filter(user=request.user_profile, organization=org).first()
    if not my_membership or my_membership.role != "owner":
        return redirect("team_settings")
    if membership.user_id == request.user_profile.id:
        return redirect("team_settings")
    membership.delete()
    return redirect("team_settings")
