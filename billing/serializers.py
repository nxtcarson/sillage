from rest_framework import serializers
from .models import Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "name", "tier", "price", "features", "stripe_price_id"]
        read_only_fields = ["id", "stripe_price_id"]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id", "organization", "plan", "status",
            "stripe_subscription_id", "stripe_customer_id",
            "current_period_end", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "organization", "stripe_subscription_id", "stripe_customer_id", "created_at", "updated_at"]
