from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from core.api_auth import SillageSessionAuthentication, IsAuthenticatedUser, OrgScopedMixin
from .models import Contact, PipelineStage, Lead, Policy, Task, Activity, Document, Automation
from .serializers import (
    ContactSerializer,
    PipelineStageSerializer,
    LeadSerializer,
    PolicySerializer,
    TaskSerializer,
    ActivitySerializer,
    DocumentSerializer,
    AutomationSerializer,
)


class ContactViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = ContactSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Contact.objects.none()
        return Contact.objects.filter(organization=org).select_related("assigned_agent")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())


class PipelineStageViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = PipelineStageSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return PipelineStage.objects.none()
        return PipelineStage.objects.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())


class LeadViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = LeadSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Lead.objects.none()
        return Lead.objects.filter(organization=org).select_related("contact", "stage")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())


class PolicyViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = PolicySerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Policy.objects.none()
        return Policy.objects.filter(organization=org).select_related("contact")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())


class TaskViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = TaskSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Task.objects.none()
        return Task.objects.filter(organization=org).select_related("assigned_to", "related_contact")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())


class ActivityViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Activity.objects.none()
        return Activity.objects.filter(organization=org).select_related("contact", "user")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org(), user=self.request.user)


class DocumentViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Document.objects.none()
        return Document.objects.filter(organization=org).select_related("contact", "policy", "uploaded_by")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org(), uploaded_by=self.request.user)


class AutomationViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = AutomationSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Automation.objects.none()
        return Automation.objects.filter(organization=org).select_related("trigger_stage")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org())
