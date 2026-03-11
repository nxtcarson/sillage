import csv
from io import StringIO

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.core.paginator import Paginator
from django.db.models import Q, Sum
import json
from core.decorators import require_auth, require_role
from .models import Contact, Lead, Policy, PipelineStage, Task, Activity
from .forms import ContactForm, LeadForm, PolicyForm, TaskForm, ActivityForm


def _get_org(request):
    from core.org import get_current_org
    return get_current_org(request)


@require_auth
def dashboard(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    from django.db.models import Sum
    from django.utils import timezone
    from datetime import timedelta
    contacts_count = Contact.objects.filter(organization=org).count()
    policies = Policy.objects.filter(organization=org, status="active")
    active_policies = policies.count()
    revenue = policies.aggregate(Sum("premium"))["premium__sum"] or 0
    commission_total = Policy.objects.filter(organization=org).aggregate(Sum("commission"))["commission__sum"] or 0
    leads_count = Lead.objects.filter(organization=org).count()
    won_leads = Lead.objects.filter(organization=org, stage__name__icontains="won").count()
    conversion = (won_leads / leads_count * 100) if leads_count else 0
    pipeline_data = []
    for stage in PipelineStage.objects.filter(organization=org).order_by("order"):
        count = Lead.objects.filter(stage=stage).count()
        value = Lead.objects.filter(stage=stage).aggregate(Sum("value"))["value__sum"] or 0
        pipeline_data.append({"name": stage.name, "count": count, "value": float(value)})
    activities = Activity.objects.filter(organization=org).select_related("contact", "user").order_by("-timestamp")[:15]
    upcoming_tasks = Task.objects.filter(organization=org, completed=False, due_date__gte=timezone.now().date()).order_by("due_date")[:10]
    renewals = Policy.objects.filter(organization=org, status="active", expiry_date__gte=timezone.now().date(), expiry_date__lte=timezone.now().date() + timedelta(days=30)).order_by("expiry_date")[:5]
    return render(request, "dashboard/index.html", {
        "contacts_count": contacts_count,
        "active_policies": active_policies,
        "revenue": revenue,
        "commission_total": commission_total,
        "conversion": conversion,
        "pipeline_data_json": json.dumps(pipeline_data),
        "activities": activities,
        "upcoming_tasks": upcoming_tasks,
        "renewals": renewals,
    })


@require_auth
def global_search(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    q = request.GET.get("q", "").strip()
    contacts = []
    policies = []
    tasks = []
    if q:
        contacts = Contact.objects.filter(organization=org).filter(
            Q(first_name__icontains=q) | Q(last_name__icontains=q) | Q(email__icontains=q)
        )[:10]
        policies = Policy.objects.filter(organization=org).filter(
            Q(policy_number__icontains=q) | Q(contact__first_name__icontains=q) | Q(contact__last_name__icontains=q)
        ).select_related("contact")[:10]
        tasks = Task.objects.filter(organization=org).filter(
            Q(title__icontains=q) | Q(description__icontains=q)
        ).select_related("related_contact")[:10]
    return render(request, "crm/search_results.html", {"q": q, "contacts": contacts, "policies": policies, "tasks": tasks})


@require_auth
def contacts_export(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    buffer = StringIO()
    w = csv.writer(buffer)
    w.writerow(["First Name", "Last Name", "Email", "Phone", "Status", "Source"])
    for c in Contact.objects.filter(organization=org).order_by("last_name", "first_name"):
        w.writerow([c.first_name, c.last_name, c.email or "", c.phone or "", c.status, c.source or ""])
    resp = HttpResponse(buffer.getvalue(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="contacts.csv"'
    return resp


@require_auth
def policies_export(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    buffer = StringIO()
    w = csv.writer(buffer)
    w.writerow(["Policy Number", "Contact", "Carrier", "Type", "Premium", "Commission", "Status", "Effective", "Expiry"])
    for p in Policy.objects.filter(organization=org).select_related("contact").order_by("-created_at"):
        w.writerow([
            p.policy_number or "",
            p.contact.full_name,
            p.carrier,
            p.type,
            p.premium,
            p.commission,
            p.status,
            p.effective_date or "",
            p.expiry_date or "",
        ])
    resp = HttpResponse(buffer.getvalue(), content_type="text/csv")
    resp["Content-Disposition"] = 'attachment; filename="policies.csv"'
    return resp


@require_auth
def contact_list(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    qs = Contact.objects.filter(organization=org).select_related("assigned_agent")
    search = request.GET.get("q", "").strip()
    if search:
        qs = qs.filter(
            Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains=search)
        )
    status = request.GET.get("status", "")
    if status:
        qs = qs.filter(status=status)
    paginator = Paginator(qs, 20)
    page = paginator.get_page(request.GET.get("page", 1))
    return render(request, "crm/contact_list.html", {"contacts": page, "search": search, "status_filter": status})


@require_auth
def contact_detail(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact = get_object_or_404(Contact, pk=pk, organization=org)
    activities = contact.activities.select_related("user").order_by("-timestamp")[:20]
    policies = contact.policies.all()
    tasks = contact.tasks.filter(completed=False)
    return render(request, "crm/contact_detail.html", {
        "contact": contact,
        "activities": activities,
        "policies": policies,
        "tasks": tasks,
    })


@require_auth
@require_role("owner", "admin", "agent")
def contact_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    form = ContactForm(request.POST or None)
    form.fields["assigned_agent"].queryset = org.members.all()
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/contact_row.html", {"contact": obj})
        return redirect("contact_detail", pk=obj.pk)
    if request.headers.get("HX-Request"):
        return render(request, "partials/contact_form.html", {"form": form})
    return render(request, "crm/contact_form.html", {"form": form, "contact": None})


@require_auth
def contact_edit(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact = get_object_or_404(Contact, pk=pk, organization=org)
    form = ContactForm(request.POST or None, instance=contact)
    form.fields["assigned_agent"].queryset = org.members.all()
    if form.is_valid():
        form.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/contact_row.html", {"contact": contact})
        return redirect("contact_detail", pk=pk)
    if request.headers.get("HX-Request"):
        return render(request, "partials/contact_form.html", {"form": form, "contact": contact})
    return render(request, "crm/contact_form.html", {"form": form, "contact": contact})


@require_auth
@require_role("owner", "admin", "agent")
def contact_delete(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact = get_object_or_404(Contact, pk=pk, organization=org)
    if request.method == "POST":
        contact.delete()
        if request.headers.get("HX-Request"):
            return HttpResponse("")
        return redirect("contact_list")
    return render(request, "crm/contact_confirm_delete.html", {"contact": contact})


@require_auth
def pipeline(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    stages = PipelineStage.objects.filter(organization=org).prefetch_related("leads__contact")
    if not stages.exists():
        PipelineStage.objects.bulk_create([
            PipelineStage(organization=org, name="New", order=0, color="#6366f1"),
            PipelineStage(organization=org, name="Contacted", order=1, color="#8b5cf6"),
            PipelineStage(organization=org, name="Quote Sent", order=2, color="#a855f7"),
            PipelineStage(organization=org, name="Negotiation", order=3, color="#d946ef"),
            PipelineStage(organization=org, name="Won", order=4, color="#22c55e"),
        ])
        stages = PipelineStage.objects.filter(organization=org).prefetch_related("leads__contact")
    leads = Lead.objects.filter(organization=org).select_related("contact", "stage")
    return render(request, "crm/pipeline.html", {"stages": stages, "leads": leads})


@require_auth
def policy_list(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    qs = Policy.objects.filter(organization=org).select_related("contact")
    status = request.GET.get("status", "")
    if status:
        qs = qs.filter(status=status)
    policy_type = request.GET.get("type", "")
    if policy_type:
        qs = qs.filter(type=policy_type)
    paginator = Paginator(qs, 20)
    page = paginator.get_page(request.GET.get("page", 1))
    return render(request, "crm/policy_list.html", {
        "policies": page,
        "status_filter": status,
        "type_filter": policy_type,
    })


@require_auth
def policy_detail(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    policy = get_object_or_404(Policy, pk=pk, organization=org)
    return render(request, "crm/policy_detail.html", {"policy": policy})


@require_auth
@require_role("owner", "admin", "agent")
def policy_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    initial = {}
    if request.GET.get("contact"):
        initial["contact"] = request.GET.get("contact")
    form = PolicyForm(request.POST or None, initial=initial)
    form.fields["contact"].queryset = Contact.objects.filter(organization=org)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.save()
        return redirect("policy_detail", pk=obj.pk)
    return render(request, "crm/policy_form.html", {"form": form, "policy": None})


@require_auth
@require_role("owner", "admin", "agent")
def policy_edit(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    policy = get_object_or_404(Policy, pk=pk, organization=org)
    form = PolicyForm(request.POST or None, instance=policy)
    form.fields["contact"].queryset = Contact.objects.filter(organization=org)
    if form.is_valid():
        form.save()
        return redirect("policy_detail", pk=pk)
    return render(request, "crm/policy_form.html", {"form": form, "policy": policy})


@require_auth
def task_list(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    qs = Task.objects.filter(organization=org).select_related("assigned_to", "related_contact")
    completed = request.GET.get("completed", "")
    if completed == "1":
        qs = qs.filter(completed=True)
    elif completed == "0":
        qs = qs.filter(completed=False)
    paginator = Paginator(qs, 20)
    page = paginator.get_page(request.GET.get("page", 1))
    return render(request, "crm/task_list.html", {"tasks": page, "completed_filter": completed})


@require_auth
@require_role("owner", "admin", "agent")
def task_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    form = TaskForm(request.POST or None)
    form.fields["assigned_to"].queryset = org.members.all()
    form.fields["related_contact"].queryset = Contact.objects.filter(organization=org)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/task_row.html", {"task": obj})
        return redirect("task_list")
    if request.headers.get("HX-Request"):
        return render(request, "partials/task_form.html", {"form": form})
    return render(request, "crm/task_form.html", {"form": form, "task": None})


@require_auth
@require_role("owner", "admin", "agent")
def task_edit(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    task = get_object_or_404(Task, pk=pk, organization=org)
    form = TaskForm(request.POST or None, instance=task)
    form.fields["assigned_to"].queryset = org.members.all()
    form.fields["related_contact"].queryset = Contact.objects.filter(organization=org)
    if form.is_valid():
        form.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/task_row.html", {"task": task})
        return redirect("task_list")
    if request.headers.get("HX-Request"):
        return render(request, "partials/task_form.html", {"form": form, "task": task})
    return render(request, "crm/task_form.html", {"form": form, "task": task})


@require_auth
@require_role("owner", "admin", "agent")
def task_toggle(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    task = get_object_or_404(Task, pk=pk, organization=org)
    task.completed = not task.completed
    task.save()
    if request.headers.get("HX-Request"):
        return render(request, "partials/task_row.html", {"task": task})
    return redirect("task_list")


@require_auth
@require_role("owner", "admin", "agent")
def activity_create(request, contact_pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact = get_object_or_404(Contact, pk=contact_pk, organization=org)
    form = ActivityForm(request.POST or None)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.contact = contact
        obj.user = request.user_profile
        obj.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/activity_item.html", {"activity": obj})
        return redirect("contact_detail", pk=contact_pk)
    if request.headers.get("HX-Request"):
        return render(request, "partials/activity_form.html", {"form": form, "contact": contact})
    return redirect("contact_detail", pk=contact_pk)


@require_auth
@require_role("owner", "admin", "agent")
def lead_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    form = LeadForm(request.POST or None)
    form.fields["contact"].queryset = Contact.objects.filter(organization=org)
    form.fields["stage"].queryset = PipelineStage.objects.filter(organization=org)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/lead_card.html", {"lead": obj})
        return redirect("pipeline")
    return render(request, "partials/lead_form.html", {"form": form})


@require_auth
@require_role("owner", "admin", "agent")
def lead_move(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    lead = get_object_or_404(Lead, pk=pk, organization=org)
    stage_id = request.POST.get("stage_id") or request.GET.get("stage_id")
    if stage_id:
        stage = get_object_or_404(PipelineStage, pk=stage_id, organization=org)
        lead.stage = stage
        lead.save()
    if request.headers.get("HX-Request"):
        return render(request, "partials/lead_card.html", {"lead": lead})
    return redirect("pipeline")
