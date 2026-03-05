from django.urls import path
from . import views

urlpatterns = [
    path("pricing/", views.pricing, name="pricing"),
    path("billing/checkout/", views.checkout_create, name="checkout_create"),
    path("billing/success/", views.checkout_success, name="checkout_success"),
    path("billing/portal/", views.customer_portal, name="customer_portal"),
    path("billing/webhook/", views.webhook, name="billing_webhook"),
]
