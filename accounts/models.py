from django.db import models
import uuid


class Organization(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=100)
    tier = models.CharField(max_length=20, default="free", choices=[
        ("free", "Free"),
        ("basic", "Basic"),
        ("standard", "Standard"),
        ("pro", "Pro"),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


ROLE_CHOICES = [
    ("owner", "Owner"),
    ("admin", "Admin"),
    ("agent", "Agent"),
    ("viewer", "Viewer"),
]


class OrganizationMembership(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("agent", "Agent"),
        ("viewer", "Viewer"),
    ]
    user = models.ForeignKey("UserProfile", on_delete=models.CASCADE, related_name="org_memberships")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="agent")
    is_primary = models.BooleanField(default=False)

    class Meta:
        unique_together = [("user", "organization")]


class Invitation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="invitations")
    email = models.EmailField(blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="agent")
    token = models.CharField(max_length=64, unique=True)
    invited_by = models.ForeignKey("UserProfile", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_valid(self):
        from django.utils import timezone
        return self.accepted_at is None and timezone.now() < self.expires_at


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("agent", "Agent"),
        ("viewer", "Viewer"),
    ]
    firebase_uid = models.CharField(max_length=128, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members", null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="agent")
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    def get_organizations(self):
        memberships = OrganizationMembership.objects.filter(user=self).select_related("organization").order_by("-is_primary", "organization__name")
        return [m.organization for m in memberships]

    def get_primary_organization(self):
        m = OrganizationMembership.objects.filter(user=self, is_primary=True).select_related("organization").first()
        if m:
            return m.organization
        if self.organization_id:
            return self.organization
        m = OrganizationMembership.objects.filter(user=self).select_related("organization").first()
        return m.organization if m else None
