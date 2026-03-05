from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("core.urls")),
    path("", include("accounts.urls")),
    path("", include("crm.urls")),
    path("", include("boards.urls")),
    path("", include("billing.urls")),
]
