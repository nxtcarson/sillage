from django import forms
from .models import Board, Column, Card

INPUT_CLASS = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"


class BoardForm(forms.ModelForm):
    class Meta:
        model = Board
        fields = ["name", "description", "is_private"]
        widgets = {
            "name": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "description": forms.Textarea(attrs={"class": INPUT_CLASS, "rows": 2}),
            "is_private": forms.CheckboxInput(attrs={"class": "rounded"}),
        }


class ColumnForm(forms.ModelForm):
    class Meta:
        model = Column
        fields = ["name", "order", "color"]
        widgets = {
            "name": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "order": forms.NumberInput(attrs={"class": INPUT_CLASS}),
            "color": forms.TextInput(attrs={"class": INPUT_CLASS, "type": "color"}),
        }


class CardForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ["title", "description", "assigned_to", "contact", "due_date"]
        widgets = {
            "title": forms.TextInput(attrs={"class": INPUT_CLASS}),
            "description": forms.Textarea(attrs={"class": INPUT_CLASS, "rows": 2}),
            "assigned_to": forms.Select(attrs={"class": INPUT_CLASS}),
            "contact": forms.Select(attrs={"class": INPUT_CLASS}),
            "due_date": forms.DateInput(attrs={"class": INPUT_CLASS, "type": "date"}),
        }
