import secrets
from datetime import timedelta

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api_auth import SillageSessionAuthentication, IsAuthenticatedUser, OrgScopedMixin
from .models import Organization, OrganizationMembership, Invitation, UserProfile
from .serializers import (
    OrganizationSerializer,
    OrganizationMembershipSerializer,
    InvitationSerializer,
    UserProfileSerializer,
)


class MeView(APIView):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    def patch(self, request):
        profile = request.user
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class OrganizationViewSet(OrgScopedMixin, viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = OrganizationSerializer

    def get_queryset(self):
        profile = self.request.user
        org_ids = list(
            OrganizationMembership.objects.filter(user=profile).values_list("organization_id", flat=True)
        )
        if profile.organization_id:
            org_ids.append(profile.organization_id)
        return Organization.objects.filter(id__in=org_ids)

    @action(detail=True, methods=["patch"])
    def update_org(self, request, pk=None):
        org = self.get_object()
        membership = OrganizationMembership.objects.filter(user=request.user, organization=org).first()
        if not membership or membership.role not in ("owner", "admin"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = OrganizationSerializer(org, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class OrganizationMembershipViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = OrganizationMembershipSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return OrganizationMembership.objects.none()
        return OrganizationMembership.objects.filter(organization=org).select_related("user")

    def update(self, request, *args, **kwargs):
        org = self.get_org()
        my_membership = OrganizationMembership.objects.filter(user=request.user, organization=org).first()
        if not my_membership or my_membership.role not in ("owner", "admin"):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        org = self.get_org()
        my_membership = OrganizationMembership.objects.filter(user=request.user, organization=org).first()
        if not my_membership or my_membership.role != "owner":
            return Response({"detail": "Only owners can remove members."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class InvitationViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = InvitationSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Invitation.objects.none()
        return Invitation.objects.filter(organization=org, accepted_at__isnull=True, expires_at__gt=timezone.now()).select_related("invited_by")

    def create(self, request, *args, **kwargs):
        org = self.get_org()
        if not org:
            return Response({"detail": "No organization."}, status=status.HTTP_400_BAD_REQUEST)
        role = request.data.get("role", "agent")
        if role not in ("owner", "admin", "agent", "viewer"):
            role = "agent"
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(days=7)
        inv = Invitation.objects.create(
            organization=org,
            email=request.data.get("email", "").strip(),
            role=role,
            token=token,
            invited_by=request.user,
            expires_at=expires_at,
        )
        invite_url = request.build_absolute_uri(f"/invite/{token}/")
        data = InvitationSerializer(inv).data
        data["invite_url"] = invite_url
        return Response(data, status=status.HTTP_201_CREATED)
