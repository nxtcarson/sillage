import logging
import os

import stripe
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api_auth import SillageSessionAuthentication, IsAuthenticatedUser, OrgScopedMixin
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer

logger = logging.getLogger(__name__)
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

PLAN_DEFAULTS = [
    ("free", "Free", 0, {"items": ["Up to 2 seats", "Up to 3 boards", "100 contacts", "500MB storage"]}),
    ("basic", "Basic", 4, {"items": ["5 seats", "5GB storage", "Email support"]}),
    ("standard", "Standard", 8, {"items": ["10 seats", "Calendar view", "20GB storage"]}),
    ("pro", "Pro", 12, {"items": ["25 seats", "Private boards", "50GB storage"]}),
]


def _is_valid_stripe_price(price_id):
    if not price_id or not isinstance(price_id, str):
        return False
    p = price_id.strip()
    return p.startswith("price_") and p != "price_xxx" and len(p) > 10


def _ensure_plans():
    if not Plan.objects.exists():
        for tier, name, price, features in PLAN_DEFAULTS:
            Plan.objects.get_or_create(tier=tier, defaults={"name": name, "price": price, "features": features})
    tier_to_env = {"basic": "STRIPE_PRICE_BASIC", "standard": "STRIPE_PRICE_STANDARD", "pro": "STRIPE_PRICE_PRO"}
    for tier, env_key in tier_to_env.items():
        price_id = os.environ.get(env_key, "").strip()
        if _is_valid_stripe_price(price_id):
            Plan.objects.filter(tier=tier).update(stripe_price_id=price_id)


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = PlanSerializer

    def get_queryset(self):
        _ensure_plans()
        return Plan.objects.all().order_by("price")


class SubscriptionViewSet(OrgScopedMixin, viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Subscription.objects.none()
        return Subscription.objects.filter(organization=org).select_related("plan")


class CreateCheckoutSessionView(OrgScopedMixin, APIView):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        org = self.get_org()
        if not org:
            return Response({"detail": "No organization found."}, status=status.HTTP_400_BAD_REQUEST)

        tier = request.data.get("tier")
        if not tier or tier == "free":
            org.tier = "free"
            org.save(update_fields=["tier"])
            return Response({"detail": "Switched to free plan."})

        plan = Plan.objects.filter(tier=tier).first()
        if not plan or (plan.price > 0 and not _is_valid_stripe_price(plan.stripe_price_id)):
            return Response({"detail": "Invalid plan or Stripe not configured."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            customer_id = None
            sub = Subscription.objects.filter(organization=org).first()
            if sub and sub.stripe_customer_id:
                customer_id = sub.stripe_customer_id
            if not customer_id:
                customer = stripe.Customer.create(
                    email=request.user.email,
                    metadata={"org_id": org.id},
                )
                customer_id = customer.id

            session = stripe.checkout.Session.create(
                customer=customer_id,
                mode="subscription",
                line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
                success_url=request.build_absolute_uri("/billing/success/") + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=request.build_absolute_uri("/pricing/"),
                metadata={"org_id": org.id, "tier": tier},
            )
            return Response({"checkout_url": session.url})
        except Exception:
            logger.exception("Stripe checkout failed for org=%s tier=%s", org.id, tier)
            return Response({"detail": "Stripe checkout failed. Check Stripe price IDs in environment."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomerPortalView(OrgScopedMixin, APIView):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        org = self.get_org()
        if not org:
            return Response({"detail": "No organization found."}, status=status.HTTP_400_BAD_REQUEST)

        sub = Subscription.objects.filter(organization=org).first()
        if not sub or not sub.stripe_customer_id:
            return Response({"detail": "No active subscription found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            session = stripe.billing_portal.Session.create(
                customer=sub.stripe_customer_id,
                return_url=request.build_absolute_uri("/dashboard/"),
            )
            return Response({"portal_url": session.url})
        except Exception:
            logger.exception("Stripe portal failed for org=%s", org.id)
            return Response({"detail": "Failed to create billing portal session."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
