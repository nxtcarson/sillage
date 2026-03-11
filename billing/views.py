import logging
import os
from datetime import datetime, timezone
import stripe
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib import messages
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from core.decorators import require_auth
from .models import Plan, Subscription

logger = logging.getLogger(__name__)
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")


def _get_org(request):
    from core.org import get_current_org
    return get_current_org(request)


def _is_valid_stripe_price(price_id):
    if not price_id or not isinstance(price_id, str):
        return False
    p = price_id.strip()
    return p.startswith("price_") and p != "price_xxx" and len(p) > 10


def _sync_stripe_price_ids():
    tier_to_env = {
        "basic": "STRIPE_PRICE_BASIC",
        "standard": "STRIPE_PRICE_STANDARD",
        "pro": "STRIPE_PRICE_PRO",
    }
    for tier, env_key in tier_to_env.items():
        price_id = os.environ.get(env_key, "").strip()
        if _is_valid_stripe_price(price_id):
            Plan.objects.filter(tier=tier).update(stripe_price_id=price_id)


@require_http_methods(["GET"])
def pricing(request):
    plans = list(Plan.objects.all().order_by("price"))
    if not plans:
        for t, n, p, f in [
            ("free", "Free", 0, {"items": ["Up to 2 seats", "Up to 3 boards", "100 contacts", "500MB storage"]}),
            ("basic", "Basic", 4, {"items": ["5 seats", "5GB storage", "Email support"]}),
            ("standard", "Standard", 8, {"items": ["10 seats", "Calendar view", "20GB storage"]}),
            ("pro", "Pro", 12, {"items": ["25 seats", "Private boards", "50GB storage"]}),
        ]:
            Plan.objects.get_or_create(tier=t, defaults={"name": n, "price": p, "features": f})
        plans = list(Plan.objects.all().order_by("price"))
    _sync_stripe_price_ids()
    plans = list(Plan.objects.all().order_by("price"))
    stripe_configured = any(_is_valid_stripe_price(p.stripe_price_id) for p in plans if p.price > 0)
    return render(request, "billing/pricing.html", {"plans": plans, "stripe_configured": stripe_configured})


@require_auth
@require_POST
def checkout_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    tier = request.POST.get("tier")
    if not tier or tier == "free":
        org.tier = "free"
        org.save()
        return redirect("dashboard")
    plan = Plan.objects.filter(tier=tier).first()
    if not plan or (plan.price > 0 and not _is_valid_stripe_price(plan.stripe_price_id)):
        return redirect("pricing")
    try:
        customer_id = None
        sub = Subscription.objects.filter(organization=org).first()
        if sub and sub.stripe_customer_id:
            customer_id = sub.stripe_customer_id
        if not customer_id:
            customer = stripe.Customer.create(email=request.user_profile.email, metadata={"org_id": org.id})
            customer_id = customer.id
        session = stripe.checkout.Session.create(
            customer=customer_id,
            mode="subscription",
            line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
            success_url=request.build_absolute_uri("/billing/success/") + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=request.build_absolute_uri("/pricing/"),
            metadata={"org_id": org.id, "tier": tier},
        )
        return redirect(session.url)
    except Exception as e:
        logger.exception("Stripe checkout failed for org=%s tier=%s", org.id if org else None, tier)
        messages.warning(request, "Checkout failed. Add STRIPE_PRICE_BASIC, STRIPE_PRICE_STANDARD, STRIPE_PRICE_PRO to Doppler with real Stripe price IDs (see .env.example).")
        return redirect("pricing")


@require_auth
def checkout_success(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    session_id = request.GET.get("session_id")
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if str(session.metadata.get("org_id")) == str(org.id):
                tier = session.metadata.get("tier", "free")
                org.tier = tier
                org.save()
                plan = Plan.objects.filter(tier=tier).first()
                Subscription.objects.update_or_create(
                    organization=org,
                    defaults={
                        "stripe_customer_id": session.get("customer") or "",
                        "stripe_subscription_id": session.get("subscription") or "",
                        "plan": plan,
                        "status": "active",
                    },
                )
        except Exception as e:
            logger.warning("Stripe checkout_success failed for session_id=%s: %s", session_id, e)
    return redirect("dashboard")


@require_auth
@require_POST
def customer_portal(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    sub = Subscription.objects.filter(organization=org).first()
    if not sub or not sub.stripe_customer_id:
        return redirect("pricing")
    try:
        session = stripe.billing_portal.Session.create(
            customer=sub.stripe_customer_id,
            return_url=request.build_absolute_uri("/dashboard/"),
        )
        return redirect(session.url)
    except Exception:
        return redirect("pricing")


@csrf_exempt
@require_POST
def webhook(request):
    payload = request.body
    sig = request.headers.get("Stripe-Signature", "")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "").strip()
    if not webhook_secret:
        return HttpResponse(status=400)
    try:
        event = stripe.Webhook.construct_event(payload, sig, webhook_secret)
    except Exception as e:
        logger.warning("Stripe webhook signature verification failed: %s", e)
        return HttpResponse(status=400)
    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        org_id = session.get("metadata", {}).get("org_id")
        tier = session.get("metadata", {}).get("tier", "free")
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")
        if org_id:
            from accounts.models import Organization
            try:
                org = Organization.objects.get(id=org_id)
                org.tier = tier
                org.save()
                plan = Plan.objects.filter(tier=tier).first()
                Subscription.objects.update_or_create(
                    organization=org,
                    defaults={
                        "stripe_customer_id": customer_id or "",
                        "stripe_subscription_id": subscription_id or "",
                        "plan": plan,
                        "status": "active",
                    },
                )
            except Organization.DoesNotExist:
                pass
    elif event.get("type") == "customer.subscription.updated":
        sub_obj = event["data"]["object"]
        try:
            sub = Subscription.objects.get(stripe_subscription_id=sub_obj["id"])
            sub.status = sub_obj.get("status", "active")
            ts = sub_obj.get("current_period_end")
            sub.current_period_end = datetime.fromtimestamp(ts, tz=timezone.utc) if ts is not None else None
            items = sub_obj.get("items", {}).get("data", [])
            if items:
                price_id = items[0].get("price", {}).get("id")
                if price_id:
                    plan = Plan.objects.filter(stripe_price_id=price_id).first()
                    if plan:
                        sub.plan = plan
            sub.save()
            if sub.organization and sub.plan:
                sub.organization.tier = sub.plan.tier
                sub.organization.save()
        except Subscription.DoesNotExist:
            pass
    elif event.get("type") == "customer.subscription.deleted":
        sub_obj = event["data"]["object"]
        try:
            sub = Subscription.objects.get(stripe_subscription_id=sub_obj["id"])
            sub.status = "canceled"
            sub.save()
            sub.organization.tier = "free"
            sub.organization.save()
        except Subscription.DoesNotExist:
            pass
    return HttpResponse(status=200)
