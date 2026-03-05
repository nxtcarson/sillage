from django.urls import path
from . import views

urlpatterns = [
    path("boards/", views.board_list, name="board_list"),
    path("boards/create/", views.board_create, name="board_create"),
    path("boards/<int:pk>/", views.board_detail, name="board_detail"),
    path("boards/<int:pk>/edit/", views.board_edit, name="board_edit"),
    path("boards/<int:pk>/delete/", views.board_delete, name="board_delete"),
    path("boards/<int:board_pk>/cards/create/", views.card_create, name="card_create"),
    path("boards/cards/<int:pk>/move/", views.card_move, name="card_move"),
    path("boards/cards/<int:pk>/edit/", views.card_edit, name="card_edit"),
    path("boards/cards/<int:pk>/delete/", views.card_delete, name="card_delete"),
]
