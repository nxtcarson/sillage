from rest_framework import viewsets

from core.api_auth import SillageSessionAuthentication, IsAuthenticatedUser, OrgScopedMixin
from .models import Board, Column, Card
from .serializers import BoardSerializer, ColumnSerializer, CardSerializer


class BoardViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = BoardSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Board.objects.none()
        return Board.objects.filter(organization=org).select_related("created_by").prefetch_related("columns__cards")

    def perform_create(self, serializer):
        serializer.save(organization=self.get_org(), created_by=self.request.user)


class ColumnViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = ColumnSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Column.objects.none()
        return Column.objects.filter(board__organization=org).prefetch_related("cards")


class CardViewSet(OrgScopedMixin, viewsets.ModelViewSet):
    authentication_classes = [SillageSessionAuthentication]
    permission_classes = [IsAuthenticatedUser]
    serializer_class = CardSerializer

    def get_queryset(self):
        org = self.get_org()
        if not org:
            return Card.objects.none()
        return Card.objects.filter(column__board__organization=org).select_related("assigned_to", "contact")
