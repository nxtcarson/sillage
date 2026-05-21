from rest_framework import serializers
from .models import Organization, OrganizationMembership, Invitation, UserProfile


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "tier", "created_at"]
        read_only_fields = ["id", "slug", "created_at"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "email", "name", "avatar_url", "role", "created_at"]
        read_only_fields = ["id", "email", "created_at"]


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = OrganizationMembership
        fields = ["id", "user", "organization", "role", "is_primary"]
        read_only_fields = ["id", "user", "organization"]


class InvitationSerializer(serializers.ModelSerializer):
    invited_by = UserProfileSerializer(read_only=True)

    class Meta:
        model = Invitation
        fields = ["id", "organization", "email", "role", "token", "invited_by", "created_at", "expires_at", "accepted_at", "is_valid"]
        read_only_fields = ["id", "token", "invited_by", "created_at", "accepted_at", "is_valid"]
