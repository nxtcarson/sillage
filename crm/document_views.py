from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
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
    return render(request, "crm/document_list.html", {"documents": documents})


@require_auth
@require_POST
def document_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    url = request.POST.get("firebase_storage_url")
    name = request.POST.get("name")
    contact_id = request.POST.get("contact") or None
    policy_id = request.POST.get("policy") or None
    if not url or not name:
        return JsonResponse({"ok": False, "error": "Missing url or name"}, status=400)
    contact = get_object_or_404(Contact, pk=contact_id, organization=org) if contact_id else None
    policy = get_object_or_404(Policy, pk=policy_id, organization=org) if policy_id else None
    doc = Document.objects.create(
        organization=org,
        name=name,
        firebase_storage_url=url,
        contact=contact,
        policy=policy,
        uploaded_by=request.user_profile,
    )
    if request.headers.get("HX-Request"):
        return render(request, "partials/document_row.html", {"doc": doc})
    return redirect("document_list")


@require_auth
@require_POST
def document_delete(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    doc = get_object_or_404(Document, pk=pk, organization=org)
    doc.delete()
    if request.headers.get("HX-Request"):
        from django.http import HttpResponse
        return HttpResponse("")
    return redirect("document_list")
