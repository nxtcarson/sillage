from datetime import timedelta

from django.utils import timezone

from .models import Automation, Task


def _format_title(tpl, lead, stage):
    name = lead.contact.full_name if lead and lead.contact else ""
    st = stage.name if stage else ""
    return (
        (tpl or "")
        .replace("{contact}", name)
        .replace("{stage}", st)
    )


def fire_lead_stage_automations(lead, previous_stage, new_stage, org, acting_user):
    if not new_stage:
        return
    if previous_stage and previous_stage.pk == new_stage.pk:
        return
    if not org:
        return
    qs = Automation.objects.filter(
        organization=org,
        is_active=True,
        trigger_type="lead_stage_change",
        trigger_stage=new_stage,
    )
    today = timezone.now().date()
    for auto in qs:
        if auto.action_type != "create_task":
            continue
        title = _format_title(auto.action_title, lead, new_stage)
        due = today + timedelta(days=auto.action_due_days)
        Task.objects.create(
            organization=org,
            title=title,
            related_contact=lead.contact,
            assigned_to=acting_user,
            due_date=due,
        )
