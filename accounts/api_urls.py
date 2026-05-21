from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import MeView, OrganizationViewSet, OrganizationMembershipViewSet, InvitationViewSet

router = DefaultRouter()
router.register(r"organizations", OrganizationViewSet, basename="api-organizations")
router.register(r"memberships", OrganizationMembershipViewSet, basename="api-memberships")
router.register(r"invitations", InvitationViewSet, basename="api-invitations")

urlpatterns = [
    path("me/", MeView.as_view(), name="api-me"),
    path("", include(router.urls)),
]
