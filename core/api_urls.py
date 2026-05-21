from django.urls import path
from . import api_views

urlpatterns = [
    path("ping/", api_views.ping, name="api-ping"),
]
