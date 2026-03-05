# Sillage

A full-featured insurance sales CRM built with Django, Firebase, HTMX, Tailwind CSS, and Stripe.

## Tech Stack

- **Django 5.x** - Backend, ORM, views
- **Firebase** - Auth (email + Google), Firestore, Storage
- **HTMX** - Dynamic partial page updates
- **Tailwind CSS** - Styling
- **Alpine.js** - Lightweight JS (modals, mobile menu)
- **Stripe** - Subscription billing

## Setup

1. Create a virtual environment and install dependencies:

```bash
pip install -r requirements.txt
npm install
```

2. Copy `.env.example` to `.env` and fill in your keys:

- Firebase: Create a project at [Firebase Console](https://console.firebase.google.com). Add Web API key, Auth domain, Storage bucket. For server-side token verification, add a service account (download JSON or set env vars).
- Stripe: Get API keys from [Stripe Dashboard](https://dashboard.stripe.com). Create products/prices for Basic, Standard, Pro tiers and set `stripe_price_id` on Plan records.

3. Run migrations:

```bash
python manage.py migrate
```

4. Build Tailwind CSS:

```bash
npm run build:css
```

5. Start the server:

```bash
python manage.py runserver
```

Open http://127.0.0.1:8000 in your browser.

## Features

- **Contacts** - CRUD, search, filter, activity timeline
- **Pipeline** - Funnel stages with leads, move between stages
- **Policies** - Track by carrier, type, status, renewals
- **Kanban Boards** - Drag-and-drop cards (SortableJS)
- **Tasks** - Assign to contacts, due dates
- **Documents** - Upload to Firebase Storage, link to contacts/policies
- **Calendar** - Monthly view of tasks and renewals (Standard+ tier)
- **Dashboard** - KPIs, pipeline chart, activity feed
- **Billing** - Stripe Checkout, Customer Portal, 4 pricing tiers

## Tier Gating

- **Free** - 2 seats, 3 boards, 100 contacts
- **Basic** - 5GB storage, priority support
- **Standard** - Calendar view, 250 automations
- **Pro** - Private boards, time tracking, 25K automations
