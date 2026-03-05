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


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("agent", "Agent"),
        ("viewer", "Viewer"),
    ]
    firebase_uid = models.CharField(max_length=128, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="agent")
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
