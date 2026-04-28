from django.db import models
from accounts.models import UserProfile, Organization


class Contact(models.Model):
    STATUS_CHOICES = [
        ("lead", "Lead"),
        ("prospect", "Prospect"),
        ("client", "Client"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="contacts")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    source = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="lead")
    assigned_agent = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_contacts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class PipelineStage(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="pipeline_stages")
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=20, default="#6366f1")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Lead(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="leads")
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="leads")
    stage = models.ForeignKey(PipelineStage, on_delete=models.SET_NULL, null=True, blank=True, related_name="leads")
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    probability = models.PositiveIntegerField(default=50)
    expected_close = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Lead: {self.contact.full_name}"


class Policy(models.Model):
    TYPE_CHOICES = [
        ("auto", "Auto"),
        ("home", "Home"),
        ("life", "Life"),
        ("health", "Health"),
        ("commercial", "Commercial"),
    ]
    STATUS_CHOICES = [
        ("quoted", "Quoted"),
        ("bound", "Bound"),
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="policies")
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="policies")
    policy_number = models.CharField(max_length=100, blank=True)
    carrier = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    premium = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    commission = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="quoted")
    effective_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Policies"

    def __str__(self):
        return f"{self.policy_number or 'Draft'} - {self.contact.full_name}"


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="tasks")
    assigned_to = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks")
    related_contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, blank=True, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-due_date", "-created_at"]

    def __str__(self):
        return self.title


class Activity(models.Model):
    TYPE_CHOICES = [
        ("call", "Call"),
        ("email", "Email"),
        ("meeting", "Meeting"),
        ("note", "Note"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="activities")
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="activities")
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name="activities")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.type}: {self.contact.full_name}"


class Document(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="documents")
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, blank=True, related_name="documents")
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, null=True, blank=True, related_name="documents")
    name = models.CharField(max_length=255)
    firebase_storage_url = models.URLField(max_length=500)
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name="uploaded_documents")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.name


class Automation(models.Model):
    TRIGGER_CHOICES = [
        ("lead_stage_change", "Lead moves to stage"),
    ]
    ACTION_CHOICES = [
        ("create_task", "Create a task"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="automations")
    name = models.CharField(max_length=255)
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_CHOICES, default="lead_stage_change")
    trigger_stage = models.ForeignKey(
        PipelineStage, on_delete=models.SET_NULL, related_name="automations", null=True, blank=True
    )
    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES, default="create_task")
    action_title = models.CharField(
        max_length=255,
        help_text="Task title. Use {contact} and {stage} as placeholders.",
    )
    action_due_days = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
