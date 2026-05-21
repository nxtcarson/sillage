from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import BoardViewSet, ColumnViewSet, CardViewSet

router = DefaultRouter()
router.register(r"boards", BoardViewSet, basename="api-boards")
router.register(r"columns", ColumnViewSet, basename="api-columns")
router.register(r"cards", CardViewSet, basename="api-cards")

urlpatterns = [
    path("", include(router.urls)),
]
