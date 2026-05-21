from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission


class SillageSessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Token "):
            token_key = auth_header[6:].strip()
            try:
                from rest_framework.authtoken.models import Token
                token_obj = Token.objects.select_related("user").get(key=token_key)
                django_user = token_obj.user
            except Exception:
                raise AuthenticationFailed("Invalid token.")
            try:
                from accounts.models import UserProfile
                profile = UserProfile.objects.select_related("organization").get(
                    email__iexact=django_user.email
                )
            except Exception:
                raise AuthenticationFailed("No profile found for this token.")
            return (profile, token_obj)

        user_id = request.session.get("user_id")
        if not user_id:
            return None
        try:
            from accounts.models import UserProfile
            profile = UserProfile.objects.select_related("organization").get(id=user_id)
        except Exception:
            raise AuthenticationFailed("Invalid session.")
        return (profile, None)

    def authenticate_header(self, request):
        return "Token"


class IsAuthenticatedUser(BasePermission):
    def has_permission(self, request, view):
        from accounts.models import UserProfile
        return isinstance(request.user, UserProfile)


class OrgScopedMixin:
    def get_org(self):
        from accounts.models import Organization, OrganizationMembership
        org_id = self.request.session.get("org_id")
        profile = self.request.user
        if org_id:
            is_member = (
                getattr(profile, "organization_id", None) == int(org_id)
                or OrganizationMembership.objects.filter(user=profile, organization_id=org_id).exists()
            )
            if is_member:
                return Organization.objects.filter(id=org_id).first()
        membership = (
            OrganizationMembership.objects
            .filter(user=profile)
            .select_related("organization")
            .order_by("-is_primary")
            .first()
        )
        if membership:
            return membership.organization
        return getattr(profile, "organization", None)
