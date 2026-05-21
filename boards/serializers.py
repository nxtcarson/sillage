from rest_framework import serializers
from .models import Board, Column, Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [
            "id", "column", "title", "description",
            "assigned_to", "contact", "order", "due_date",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ColumnSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "board", "name", "order", "color", "cards"]
        read_only_fields = ["id"]


class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = [
            "id", "organization", "name", "description",
            "is_private", "created_by", "created_at", "columns",
        ]
        read_only_fields = ["id", "organization", "created_by", "created_at"]
