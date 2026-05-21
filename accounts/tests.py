from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from accounts.models import UserProfile

User = get_user_model()

SIGNUP_URL = "/api/auth/registration/"
LOGIN_URL = "/api/auth/login/"
ME_URL = "/api/accounts/me/"

VALID_EMAIL = "testuser@example.com"
VALID_PASSWORD = "StrongPass123!"


class SignupProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_signup_creates_profile(self):
        resp = self.client.post(SIGNUP_URL, {
            "email": VALID_EMAIL,
            "password1": VALID_PASSWORD,
            "password2": VALID_PASSWORD,
        }, format="json")
        self.assertEqual(resp.status_code, 201, resp.content)
        self.assertTrue(User.objects.filter(email=VALID_EMAIL).exists())
        self.assertTrue(UserProfile.objects.filter(email=VALID_EMAIL).exists())

    def test_duplicate_signup_fails(self):
        payload = {
            "email": VALID_EMAIL,
            "password1": VALID_PASSWORD,
            "password2": VALID_PASSWORD,
        }
        self.client.post(SIGNUP_URL, payload, format="json")
        resp = self.client.post(SIGNUP_URL, payload, format="json")
        self.assertEqual(resp.status_code, 400, resp.content)

    def test_login_returns_token(self):
        self.client.post(SIGNUP_URL, {
            "email": VALID_EMAIL,
            "password1": VALID_PASSWORD,
            "password2": VALID_PASSWORD,
        }, format="json")
        resp = self.client.post(LOGIN_URL, {
            "email": VALID_EMAIL,
            "password": VALID_PASSWORD,
        }, format="json")
        self.assertEqual(resp.status_code, 200, resp.content)
        self.assertIn("key", resp.json())

    def test_me_endpoint_returns_profile(self):
        self.client.post(SIGNUP_URL, {
            "email": VALID_EMAIL,
            "password1": VALID_PASSWORD,
            "password2": VALID_PASSWORD,
        }, format="json")
        login_resp = self.client.post(LOGIN_URL, {
            "email": VALID_EMAIL,
            "password": VALID_PASSWORD,
        }, format="json")
        token = login_resp.json()["key"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        resp = self.client.get(ME_URL)
        self.assertEqual(resp.status_code, 200, resp.content)
        data = resp.json()
        self.assertEqual(data["email"], VALID_EMAIL)

    def test_me_endpoint_requires_auth(self):
        resp = self.client.get(ME_URL)
        self.assertEqual(resp.status_code, 401, resp.content)
