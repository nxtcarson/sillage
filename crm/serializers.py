from rest_framework import serializers
from .models import Contact, PipelineStage, Lead, Policy, Task, Activity, Document, Automation


class ContactSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Contact
        fields = [
            "id", "organization", "first_name", "last_name", "full_name",
            "email", "phone", "address", "date_of_birth", "source",
            "status", "assigned_agent", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "organization", "created_at", "updated_at"]


class PipelineStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineStage
        fields = ["id", "organization", "name", "order", "color"]
        read_only_fields = ["id", "organization"]


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "id", "organization", "contact", "stage", "value",
            "probability", "expected_close", "notes", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "organization", "created_at", "updated_at"]


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = [
            "id", "organization", "contact", "policy_number", "carrier",
            "type", "premium", "commission", "status",
            "effective_date", "expiry_date", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "organization", "created_at", "updated_at"]


class TaskSerializer(serializers.ModelSerializer):
    related_contact_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id", "organization", "assigned_to", "related_contact",
            "related_contact_name", "title", "description", "due_date",
            "priority", "completed", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "organization", "related_contact_name", "created_at", "updated_at"]

    def get_related_contact_name(self, obj):
        if obj.related_contact:
            return obj.related_contact.full_name
        return None


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "organization", "contact", "user", "type", "description", "timestamp"]
        read_only_fields = ["id", "organization", "user", "timestamp"]


class DocumentSerializer(serializers.ModelSerializer):
    download_url = serializers.ReadOnlyField()

    class Meta:
        model = Document
        fields = [
            "id", "organization", "contact", "policy", "name",
            "file", "firebase_storage_url", "download_url",
            "uploaded_by", "uploaded_at",
        ]
        read_only_fields = ["id", "organization", "uploaded_by", "uploaded_at", "download_url"]


class AutomationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automation
        fields = [
            "id", "organization", "name", "trigger_type", "trigger_stage",
            "action_type", "action_title", "action_due_days", "is_active",
            "last_run", "created_at",
        ]
        read_only_fields = ["id", "organization", "last_run", "created_at"]
