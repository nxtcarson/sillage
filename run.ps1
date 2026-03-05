if (Get-Command doppler -ErrorAction SilentlyContinue) {
  doppler run -- python manage.py runserver 8001
} else {
  python manage.py runserver 8001
}
