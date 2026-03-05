if (Get-Command doppler -ErrorAction SilentlyContinue) {
  doppler run -- python manage.py runserver
} else {
  python manage.py runserver
}
