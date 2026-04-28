from django.contrib import admin

from .models import Automation


@admin.register(Automation)
class AutomationAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "trigger_stage", "is_active", "created_at")
    list_filter = ("is_active", "organization")
    search_fields = ("name", "action_title")
