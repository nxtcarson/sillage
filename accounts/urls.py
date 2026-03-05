from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_page, name="login"),
    path("signup/", views.signup_page, name="signup"),
    path("auth/login/", views.firebase_login, name="firebase_login"),
    path("auth/signup/", views.firebase_signup, name="firebase_signup"),
    path("auth/finish-sign-in/", views.finish_sign_in_page, name="finish_sign_in"),
    path("auth/logout/", views.logout_view, name="logout"),
]
