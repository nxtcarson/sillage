from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from core.decorators import require_auth
from .models import Board, Column, Card
from .forms import BoardForm, ColumnForm, CardForm


def _get_org(request):
    from core.org import get_current_org
    return get_current_org(request)


@require_auth
def board_list(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    boards = Board.objects.filter(organization=org).order_by("-created_at")
    return render(request, "boards/board_list.html", {"boards": boards})


@require_auth
def board_detail(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    board = get_object_or_404(Board, pk=pk, organization=org)
    columns = board.columns.prefetch_related("cards__contact", "cards__assigned_to")
    return render(request, "boards/board_detail.html", {"board": board, "columns": columns})


@require_auth
def board_create(request):
    org = _get_org(request)
    if not org:
        return redirect("login")
    form = BoardForm(request.POST or None)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.organization = org
        obj.created_by = request.user_profile
        obj.save()
        Column.objects.create(board=obj, name="To Do", order=0)
        Column.objects.create(board=obj, name="In Progress", order=1)
        Column.objects.create(board=obj, name="Done", order=2)
        return redirect("board_detail", pk=obj.pk)
    return render(request, "boards/board_form.html", {"form": form, "board": None})


@require_auth
def board_edit(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    board = get_object_or_404(Board, pk=pk, organization=org)
    form = BoardForm(request.POST or None, instance=board)
    if form.is_valid():
        form.save()
        return redirect("board_detail", pk=pk)
    return render(request, "boards/board_form.html", {"form": form, "board": board})


@require_auth
def board_delete(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    board = get_object_or_404(Board, pk=pk, organization=org)
    if request.method == "POST":
        board.delete()
        return redirect("board_list")
    return render(request, "boards/board_confirm_delete.html", {"board": board})


@require_auth
@require_POST
def card_create(request, board_pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    board = get_object_or_404(Board, pk=board_pk, organization=org)
    column_id = request.POST.get("column_id")
    column = get_object_or_404(Column, pk=column_id, board=board) if column_id else board.columns.first()
    if not column:
        return HttpResponse("No column", status=400)
    form = CardForm(request.POST or None)
    form.fields["assigned_to"].queryset = org.members.all()
    form.fields["contact"].queryset = org.contacts.all()
    if form.is_valid():
        obj = form.save(commit=False)
        obj.column = column
        obj.order = column.cards.count()
        obj.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/card_item.html", {"card": obj})
        return redirect("board_detail", pk=board_pk)
    if request.headers.get("HX-Request"):
        return render(request, "partials/card_form.html", {"form": form, "column": column, "card": None})
    return redirect("board_detail", pk=board_pk)


@require_auth
@require_POST
def card_move(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    card = get_object_or_404(Card, pk=pk, column__board__organization=org)
    column_id = request.POST.get("column_id") or request.GET.get("column_id")
    if column_id:
        column = get_object_or_404(Column, pk=column_id, board=card.column.board)
        card.column = column
        order = request.POST.get("order") or request.GET.get("order", 0)
        card.order = int(order) if str(order).isdigit() else column.cards.count()
        card.save()
    if request.headers.get("HX-Request"):
        return render(request, "partials/card_item.html", {"card": card})
    return redirect("board_detail", pk=card.column.board_id)


@require_auth
def card_edit(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    card = get_object_or_404(Card, pk=pk, column__board__organization=org)
    form = CardForm(request.POST or None, instance=card)
    form.fields["assigned_to"].queryset = org.members.all()
    form.fields["contact"].queryset = org.contacts.all()
    if form.is_valid():
        form.save()
        if request.headers.get("HX-Request"):
            return render(request, "partials/card_item.html", {"card": card})
        return redirect("board_detail", pk=card.column.board_id)
    if request.headers.get("HX-Request"):
        return render(request, "partials/card_form.html", {"form": form, "card": card, "column": card.column})
    return redirect("board_detail", pk=card.column.board_id)


@require_auth
def card_delete(request, pk):
    org = _get_org(request)
    if not org:
        return redirect("login")
    card = get_object_or_404(Card, pk=pk, column__board__organization=org)
    board_pk = card.column.board_id
    if request.method == "POST":
        card.delete()
        if request.headers.get("HX-Request"):
            return HttpResponse("")
        return redirect("board_detail", pk=board_pk)
    return render(request, "partials/card_confirm_delete.html", {"card": card})
