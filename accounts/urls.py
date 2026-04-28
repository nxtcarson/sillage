from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_page, name="login"),
    path("signup/", views.signup_page, name="signup"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/switch-org/", views.switch_org, name="switch_org"),
    path("settings/companies/", views.create_org_page, name="create_org"),
    path("settings/team/", views.team_settings, name="team_settings"),
    path("settings/team/invite/", views.invite_create, name="invite_create"),
    path("invite/<str:token>/", views.invite_accept, name="invite_accept"),
    path("settings/profile/", views.profile_settings, name="profile_settings"),
    path("settings/org/", views.org_settings, name="org_settings"),
    path("settings/team/member/<int:membership_id>/role/", views.member_change_role, name="member_change_role"),
    path("settings/team/member/<int:membership_id>/remove/", views.member_remove, name="member_remove"),
]
