from django.urls import path
from . import views
from . import document_views
from . import calendar_views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("search/", views.global_search, name="global_search"),
    path("contacts/export/", views.contacts_export, name="contacts_export"),
    path("policies/export/", views.policies_export, name="policies_export"),
    path("contacts/", views.contact_list, name="contact_list"),
    path("contacts/create/", views.contact_create, name="contact_create"),
    path("contacts/<int:pk>/", views.contact_detail, name="contact_detail"),
    path("contacts/<int:pk>/edit/", views.contact_edit, name="contact_edit"),
    path("contacts/<int:pk>/delete/", views.contact_delete, name="contact_delete"),
    path("pipeline/", views.pipeline, name="pipeline"),
    path("pipeline/leads/create/", views.lead_create, name="lead_create"),
    path("pipeline/leads/<int:pk>/move/", views.lead_move, name="lead_move"),
    path("policies/", views.policy_list, name="policy_list"),
    path("policies/create/", views.policy_create, name="policy_create"),
    path("policies/<int:pk>/", views.policy_detail, name="policy_detail"),
    path("policies/<int:pk>/edit/", views.policy_edit, name="policy_edit"),
    path("tasks/", views.task_list, name="task_list"),
    path("tasks/create/", views.task_create, name="task_create"),
    path("tasks/<int:pk>/edit/", views.task_edit, name="task_edit"),
    path("tasks/<int:pk>/toggle/", views.task_toggle, name="task_toggle"),
    path("contacts/<int:contact_pk>/activities/", views.activity_create, name="activity_create"),
    path("documents/", document_views.document_list, name="document_list"),
    path("documents/create/", document_views.document_create, name="document_create"),
    path("documents/<int:pk>/delete/", document_views.document_delete, name="document_delete"),
    path("calendar/", calendar_views.calendar_view, name="calendar"),
    path("automations/", views.automation_list, name="automation_list"),
    path("automations/create/", views.automation_create, name="automation_create"),
    path("automations/<int:pk>/edit/", views.automation_edit, name="automation_edit"),
    path("automations/<int:pk>/delete/", views.automation_delete, name="automation_delete"),
    path("automations/<int:pk>/toggle/", views.automation_toggle, name="automation_toggle"),
]
