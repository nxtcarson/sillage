from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import Organization, OrganizationMembership, Invitation, UserProfile


class EmailOnlyRegisterSerializer(RegisterSerializer):
    username = None
    first_name = serializers.CharField(required=False, allow_blank=True, default="")
    last_name = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_email(self, email):
        from allauth.account.adapter import get_adapter
        from django.contrib.auth import get_user_model
        email = get_adapter().clean_email(email)
        User = get_user_model()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "A user is already registered with this e-mail address."
            )
        return email

    def get_cleaned_data(self):
        return {
            "email": self.validated_data.get("email", ""),
            "password1": self.validated_data.get("password1", ""),
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
        }


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
