from django.urls import path, include
from . import api_views

urlpatterns = [
    path("ping/", api_views.ping, name="api-ping"),
    path("accounts/", include("accounts.api_urls")),
    path("crm/", include("crm.api_urls")),
    path("boards/", include("boards.api_urls")),
    path("billing/", include("billing.api_urls")),
]
