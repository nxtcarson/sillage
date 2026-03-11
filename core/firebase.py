import logging
import os
from firebase_admin import credentials, initialize_app, auth

logger = logging.getLogger(__name__)
_firebase_app = None


def get_firebase_app():
    global _firebase_app
    if _firebase_app is None:
        cred_dict = {
            "type": "service_account",
            "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
            "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
            "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        try:
            if os.path.exists("firebase-service-account.json"):
                cred = credentials.Certificate("firebase-service-account.json")
            elif (cred_dict.get("project_id") and cred_dict.get("private_key") and cred_dict.get("client_email")
                  and "..." not in (cred_dict.get("private_key") or "")):
                cred = credentials.Certificate(cred_dict)
            else:
                return None
            _firebase_app = initialize_app(cred)
        except Exception as e:
            logger.warning("Firebase Admin init failed: %s", e)
            return None
    return _firebase_app


def verify_id_token(token):
    try:
        app = get_firebase_app()
        if app is None:
            return None
        return auth.verify_id_token(token, check_revoked=False)
    except Exception as e:
        logger.warning("Firebase token verification failed: %s", e)
        return None


def get_firestore():
    from firebase_admin import firestore
    app = get_firebase_app()
    return firestore.client(app) if app else None


def get_storage_bucket():
    from firebase_admin import storage
    app = get_firebase_app()
    if app is None:
        return None
    return storage.bucket()
