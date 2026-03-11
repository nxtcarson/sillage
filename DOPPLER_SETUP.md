# Doppler Setup for Sillage

## 1. Create Doppler Account & Project

1. Go to [doppler.com](https://doppler.com) and sign up (free)
2. Create a new project named **sillage**
3. Create a config named **dev**

## 2. Add These Variables in Doppler Dashboard

In your project → **dev** config, add each variable. Get values from Firebase Console and Stripe Dashboard.

| Variable | Where to get it |
|----------|-----------------|
| `SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | `True` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project settings → Project ID |
| `FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps → SDK config |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` |
| `FIREBASE_PRIVATE_KEY_ID` | Service account JSON (Firebase Console → Service accounts → Generate new private key) |
| `FIREBASE_PRIVATE_KEY` | Service account JSON — use `\n` for newlines |
| `FIREBASE_CLIENT_EMAIL` | Service account JSON |
| `FIREBASE_CLIENT_ID` | Service account JSON |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks (optional for dev) |
| `STRIPE_PRICE_BASIC` | Stripe Dashboard → Products → Create product → Copy price ID (e.g. price_xxx) |
| `STRIPE_PRICE_STANDARD` | Same as above for Standard plan |
| `STRIPE_PRICE_PRO` | Same as above for Pro plan |
| `DATABASE_URL` | `sqlite:///db.sqlite3` |

**Firebase Admin quick upload:** Download `firebase-service-account.json` from Firebase Console (Project settings → Service accounts → Generate new private key), place it in the project root, then run `python scripts/upload_firebase_to_doppler.py`. Or run `.\doppler-setup.ps1` — it will offer to upload it if the file exists.

**Authorized domains:** Firebase Console → Build → Authentication → Settings → Authorized domains. Add `localhost` and `127.0.0.1` if missing. On localhost, Google sign-in uses redirect (not popup) to avoid browser privacy restrictions.

## 3. Install Doppler CLI

**Windows (PowerShell):**
```powershell
winget install Doppler.Doppler
```

Or download from [doppler.com/docs/install-cli](https://docs.doppler.com/docs/install-cli)

## 4. Link This Project

From the project root:

```powershell
.\doppler-setup.ps1
```

Or manually:
```powershell
doppler login
doppler setup
```

When prompted:
- **Project:** sillage
- **Config:** dev

If you have a `.env` file, the setup script will offer to upload it to Doppler.

## 5. Run the App

```powershell
.\run.ps1
```

Or:
```powershell
doppler run -- python manage.py runserver
```

## On Another Computer

1. Clone the repo
2. `doppler login`
3. `doppler setup` (select sillage / dev)
4. `.\run.ps1`

No need to copy `.env` — secrets sync from Doppler.
