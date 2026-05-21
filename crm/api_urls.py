from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    ContactViewSet,
    PipelineStageViewSet,
    LeadViewSet,
    PolicyViewSet,
    TaskViewSet,
    ActivityViewSet,
    DocumentViewSet,
    AutomationViewSet,
)

router = DefaultRouter()
router.register(r"contacts", ContactViewSet, basename="api-contacts")
router.register(r"pipeline-stages", PipelineStageViewSet, basename="api-pipeline-stages")
router.register(r"leads", LeadViewSet, basename="api-leads")
router.register(r"policies", PolicyViewSet, basename="api-policies")
router.register(r"tasks", TaskViewSet, basename="api-tasks")
router.register(r"activities", ActivityViewSet, basename="api-activities")
router.register(r"documents", DocumentViewSet, basename="api-documents")
router.register(r"automations", AutomationViewSet, basename="api-automations")

urlpatterns = [
    path("", include(router.urls)),
]
