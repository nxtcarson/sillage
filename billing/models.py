from django.db import models
from accounts.models import Organization


class Plan(models.Model):
    name = models.CharField(max_length=100)
    stripe_price_id = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tier = models.CharField(max_length=20, unique=True, choices=[
        ("free", "Free"),
        ("basic", "Basic"),
        ("standard", "Standard"),
        ("pro", "Pro"),
    ])
    features = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, related_name="subscriptions")
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default="active")
    current_period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
