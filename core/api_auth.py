from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission


class SillageSessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
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
        return "Session"


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
        return getattr(profile, "organization", None)
