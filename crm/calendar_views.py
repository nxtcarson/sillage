from django.shortcuts import render
from django.utils import timezone
from datetime import date, timedelta
from calendar import monthrange
from core.decorators import require_auth, require_tier
from .models import Task, Policy


def _get_org(request):
    return getattr(request, "user_profile", None) and request.user_profile.organization


def _month_weeks(year, month):
    first = date(year, month, 1)
    last_day = monthrange(year, month)[1]
    last = date(year, month, last_day)
    start = first - timedelta(days=first.weekday())
    weeks = []
    current = start
    for _ in range(6):
        week = []
        for _ in range(7):
            week.append(current)
            current += timedelta(days=1)
        weeks.append(week)
    return weeks


@require_auth
@require_tier("standard", "pro")
def calendar_view(request):
    org = _get_org(request)
    if not org:
        return render(request, "crm/calendar_upgrade.html")
    year = int(request.GET.get("year", timezone.now().year))
    month = int(request.GET.get("month", timezone.now().month))
    if month < 1:
        month, year = 12, year - 1
    elif month > 12:
        month, year = 1, year + 1
    tasks = Task.objects.filter(organization=org, due_date__isnull=False).select_related("related_contact")
    renewals = Policy.objects.filter(organization=org, status="active", expiry_date__isnull=False)
    events_by_date = {}
    for t in tasks:
        if t.due_date and t.due_date.year == year and t.due_date.month == month:
            k = t.due_date.isoformat()
            events_by_date.setdefault(k, []).append({"title": t.title, "type": "task", "url": f"/tasks/{t.pk}/edit/"})
    for p in renewals:
        if p.expiry_date and p.expiry_date.year == year and p.expiry_date.month == month:
            k = p.expiry_date.isoformat()
            events_by_date.setdefault(k, []).append({"title": f"Renewal: {p.contact.full_name}", "type": "renewal", "url": f"/policies/{p.pk}/"})
    raw_weeks = _month_weeks(year, month)
    weeks = []
    for week in raw_weeks:
        row = []
        for day in week:
            events = events_by_date.get(day.isoformat(), [])
            row.append({"day": day, "events": events})
        weeks.append(row)
    prev_month = month - 1 if month > 1 else 12
    prev_year = year if month > 1 else year - 1
    next_month = month + 1 if month < 12 else 1
    next_year = year if month < 12 else year + 1
    return render(request, "crm/calendar.html", {
        "year": year, "month": month,
        "weeks": weeks,
        "prev_month": prev_month, "prev_year": prev_year,
        "next_month": next_month, "next_year": next_year,
    })
