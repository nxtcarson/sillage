from django.db import models
from accounts.models import Organization, UserProfile
from crm.models import Contact


class Board(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="boards")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_boards")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="columns")
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=20, default="#6366f1")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Card(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="cards")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="board_cards")
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name="board_cards")
    order = models.PositiveIntegerField(default=0)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return self.title
