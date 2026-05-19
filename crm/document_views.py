from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_http_methods
from core.decorators import require_auth
from .models import Document, Contact, Policy


def _get_org(request):
    from core.org import get_current_org
    return get_current_org(request)


@require_auth
@require_http_methods(["GET"])
def document_list(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact_id = request.GET.get("contact")
    policy_id = request.GET.get("policy")
    qs = Document.objects.filter(organization=org).select_related("contact", "policy", "uploaded_by")
    if contact_id:
        qs = qs.filter(contact_id=contact_id)
    if policy_id:
        qs = qs.filter(policy_id=policy_id)
    documents = qs.order_by("-uploaded_at")[:50]
    contacts = org.contacts.all().order_by("last_name", "first_name")[:200]
    policies = org.policies.select_related("contact").order_by("-created_at")[:200]
    return render(request, "crm/document_list.html", {
        "documents": documents,
        "contacts": contacts,
        "policies": policies,
        "filter_contact": contact_id,
        "filter_policy": policy_id,
    })


@require_auth
@require_POST
def document_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    contact_id = request.POST.get("contact") or None
    policy_id = request.POST.get("policy") or None
    contact = get_object_or_404(Contact, pk=contact_id, organization=org) if contact_id else None
    policy = get_object_or_404(Policy, pk=policy_id, organization=org) if policy_id else None

    files = request.FILES.getlist("file")
    url = request.POST.get("firebase_storage_url", "").strip()
    name = request.POST.get("name", "").strip()
    created = []

    if files:
        for uploaded in files:
            doc = Document.objects.create(
                organization=org,
                name=uploaded.name,
                file=uploaded,
                contact=contact,
                policy=policy,
                uploaded_by=request.user_profile,
            )
            created.append(doc)
    elif url and name:
        doc = Document.objects.create(
            organization=org,
            name=name,
            firebase_storage_url=url,
            contact=contact,
            policy=policy,
            uploaded_by=request.user_profile,
        )
        created.append(doc)
    else:
        if request.headers.get("HX-Request"):
            return HttpResponse("Choose a file to upload.", status=400)
        return redirect("document_list")

    if request.headers.get("HX-Request"):
        return render(request, "partials/document_rows.html", {"documents": created})
    return redirect("document_list")


@require_auth
@require_POST
def document_delete(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    doc = get_object_or_404(Document, pk=pk, organization=org)
    if doc.file:
        doc.file.delete(save=False)
    doc.delete()
    if request.headers.get("HX-Request"):
        return HttpResponse("")
    return redirect("document_list")
