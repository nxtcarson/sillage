# Sillage

A full-featured insurance sales CRM built as a multi-tenant SaaS application with Django, HTMX, Tailwind CSS, Alpine.js, and Stripe.

## Tech Stack

- **Django 5.x** — Backend framework, ORM, views, authentication
- **HTMX** — Dynamic partial page updates without full reloads
- **Tailwind CSS** — Utility-first styling with custom design system
- **Alpine.js** — Lightweight JS for modals and interactive UI
- **Stripe** — Subscription billing and customer portal
- **SQLite** — Local development database

## Setup

1. Create a virtual environment and install dependencies:

```bash
pip install -r requirements.txt
npm install
```

2. Configure environment variables — copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:
- `SECRET_KEY` — Django secret key
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — from [Stripe Dashboard](https://dashboard.stripe.com)
- `STRIPE_WEBHOOK_SECRET` — from Stripe webhook settings

Alternatively, use Doppler for secret management — see [DOPPLER_SETUP.md](DOPPLER_SETUP.md).

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

- **Authentication** — Email/password signup, login, profile settings
- **Multi-Org Support** — Team invitations, role-based access (admin, member, viewer)
- **Contacts** — CRUD, search, filter, activity timeline
- **Pipeline** — Funnel stages with leads, drag between stages
- **Policies** — Track by carrier, type, status, and renewals
- **Automations** — Trigger actions (e.g. create task) when lead stage changes
- **Kanban Boards** — Drag-and-drop cards via SortableJS
- **Dashboard** — KPIs, pipeline overview, activity feed
- **Billing** — Stripe Checkout, Customer Portal, 4 pricing tiers

## Tier Gating

| Tier | Seats | Boards | Contacts | Storage | Automations |
|------|-------|--------|----------|---------|-------------|
| Free | 2 | 3 | 100 | — | — |
| Basic | 5 | 10 | 500 | 5 GB | — |
| Standard | 10 | 25 | 2,500 | 25 GB | 250 |
| Pro | Unlimited | Unlimited | 25,000 | 100 GB | 25,000 |
