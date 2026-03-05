from django import forms
from .models import Contact, Lead, Policy, Task, Activity, PipelineStage

INPUT_CLASS = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ["first_name", "last_name", "email", "phone", "address", "date_of_birth", "source", "status", "assigned_agent"]
        widgets = {
            "first_name": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "last_name": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "email": forms.EmailInput(attrs={"class": INPUT_CLASS}),
            "phone": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "address": forms.Textarea(attrs={"class": INPUT_CLASS, "rows": 2}),
            "date_of_birth": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
            "source": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "status": forms.Select(attrs={"class": INPUT_CLASS}),
            "assigned_agent": forms.Select(attrs={"class": INPUT_CLASS}),
        }


class LeadForm(forms.ModelForm):
    class Meta:
        model = Lead
        fields = ["contact", "stage", "value", "probability", "expected_close", "notes"]
        widgets = {
            "contact": forms.Select(attrs={"class": INPUT_CLASS}),
            "stage": forms.Select(attrs={"class": INPUT_CLASS}),
            "value": forms.NumberInput(attrs={"class": INPUT_CLASS, "step": "0.01"}),
            "probability": forms.NumberInput(attrs={"class": INPUT_CLASS}),
            "expected_close": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
            "notes": forms.Textarea(attrs={"class": INPUT_CLASS, "rows": 2}),
        }


class PolicyForm(forms.ModelForm):
    class Meta:
        model = Policy
        fields = ["contact", "policy_number", "carrier", "type", "premium", "commission", "status", "effective_date", "expiry_date"]
        widgets = {
            "contact": forms.Select(attrs={"class": INPUT_CLASS}),
            "policy_number": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "carrier": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "type": forms.Select(attrs={"class": INPUT_CLASS}),
            "premium": forms.NumberInput(attrs={"class": INPUT_CLASS, "step": "0.01"}),
            "commission": forms.NumberInput(attrs={"class": INPUT_CLASS, "step": "0.01"}),
            "status": forms.Select(attrs={"class": INPUT_CLASS}),
            "effective_date": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
            "expiry_date": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
        }


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["title", "description", "assigned_to", "related_contact", "due_date", "priority", "completed"]
        widgets = {
            "title": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "description": forms.Textarea(attrs={"class": INPUT_CLASS, "rows": 2}),
            "assigned_to": forms.Select(attrs={"class": INPUT_CLASS}),
            "related_contact": forms.Select(attrs={"class": INPUT_CLASS}),
            "due_date": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
            "priority": forms.Select(attrs={"class": INPUT_CLASS}),
            "completed": forms.CheckboxInput(attrs={"class": "rounded"}),
        }


class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ["type", "description"]
        widgets = {
            "type": forms.Select(attrs={"class": INPUT_CLASS}),
            "description": forms.TextInput(attrs={"class": INPUT_CLASS}),
        }


class PipelineStageForm(forms.ModelForm):
    class Meta:
        model = PipelineStage
        fields = ["name", "order", "color"]
