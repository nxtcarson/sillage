from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import PlanViewSet, SubscriptionViewSet, CreateCheckoutSessionView, CustomerPortalView

router = DefaultRouter()
router.register(r"plans", PlanViewSet, basename="api-plans")
router.register(r"subscriptions", SubscriptionViewSet, basename="api-subscriptions")

urlpatterns = [
    path("", include(router.urls)),
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="api-create-checkout-session"),
    path("customer-portal/", CustomerPortalView.as_view(), name="api-customer-portal"),
]
