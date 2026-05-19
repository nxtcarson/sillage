# Sillage CRM — Field-Worker Test Paths

> Perspective: An insurance agent or broker using Sillage daily to manage contacts, policies, pipeline, and renewals.

---

## Test Path 1: Morning Routine (Dashboard)

**Goal:** Agent starts their day by checking what needs attention.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/dashboard/` | Stat cards show Contacts, Policies, Revenue, Conversion % |
| 2 | Review Pipeline Overview widget | Each stage shows correct bar with that stage's color |
| 3 | Check Upcoming Tasks panel | Tasks sorted by due date, overdue shown in red |
| 4 | Review Recent Activity feed | Last 15 activities with contact links, timestamped |
| 5 | Check Policy Renewals panel | Policies expiring in next 30 days highlighted in amber |
| 6 | Click "View pipeline" link | Navigates to `/pipeline/` |
| 7 | Click a contact name in Recent Activity | Navigates to correct contact detail |

**Pass Criteria:** All widgets populated, no broken layouts, links work.

---

## Test Path 2: New Lead Intake Flow

**Goal:** Agent just got a referral — adds them to the CRM and pipeline.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "+ New" → Contact (header dropdown) | Navigates to Add Contact form |
| 2 | Fill: First=Jane, Last=Doe, Email=jane.doe@example.com, Phone=555-0100, Status=Lead, Source=Referral | Form fields render with correct labels and styles |
| 3 | Submit | Redirects to Jane Doe's contact detail page |
| 4 | Verify contact shows in `/contacts/` list | Jane listed with Lead badge |
| 5 | Navigate to Pipeline → click "Add Lead" | Navigates to New Lead form |
| 6 | Fill: Contact=Jane Doe, Stage=First stage, Value=8000, Probability=60 | Form styled consistently |
| 7 | Submit | Redirects to pipeline; Jane's card appears in the first stage column |
| 8 | Use the "Move to stage…" dropdown on Jane's card | Card moves to the selected stage |

**Pass Criteria:** Contact and lead created correctly; pipeline card visible and movable.

---

## Test Path 3: Policy Binding

**Goal:** Prospect says yes — agent binds a new auto policy.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Contacts → search "Doe" | Jane Doe appears in results |
| 2 | Click Jane Doe → click "Add policy" | Navigates to New Policy form with Jane pre-selected |
| 3 | Fill: Carrier=State Farm, Type=Auto, Policy #=POL-2026-001, Premium=1400, Commission=140, Status=Active, Effective=today, Expiry=+1yr | Form fields correct, date pickers work |
| 4 | Submit | Redirects to Jane's contact detail; policy listed in Policies card |
| 5 | Click the policy → verify Policy Detail page | Shows carrier, premium, commission, dates, quick actions |
| 6 | Navigate to Policies list (`/policies/`) | Jane's policy appears, filterable by status and type |

**Pass Criteria:** Policy saved, shows on contact detail, visible in policy list.

---

## Test Path 4: Activity Logging & Follow-up Task

**Goal:** Agent had a call — logs it and creates a follow-up task.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Jane Doe's contact detail | Activity section visible at bottom |
| 2 | Activity log: Type=Call, Description="Reviewed auto policy terms, client happy" | Activity form submits inline |
| 3 | Verify activity appears at top of the activity list | Shows timestamp, type badge, description |
| 4 | Click "Add task" in the Tasks section header | Navigates to New Task form with Jane pre-selected |
| 5 | Fill: Title="Send policy documents to Jane Doe", Due=tomorrow, Priority=High | Form renders in styled card |
| 6 | Submit | Redirects back; task appears in Jane's Tasks card |
| 7 | Navigate to `/tasks/` | Task shows with red High priority badge |
| 8 | Mark task complete using the circle checkbox | Task moves to completed state (strikethrough) |

**Pass Criteria:** Activity logged inline, task created with priority badge, toggle works.

---

## Test Path 5: Calendar & Time Management

**Goal:** Agent wants to see their week at a glance.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/calendar/` | Current month shown as "Month Year" (e.g. "May 2026") |
| 2 | Verify today's date has a highlighted circle | Brand-colored circle on today |
| 3 | Check tasks appear on their due dates | Blue task chips visible on correct dates |
| 4 | Check renewal policies appear | Amber renewal chips on expiry dates |
| 5 | Click a task chip | Navigates to the task edit page |
| 6 | Click Prev / Next navigation arrows | Month changes correctly |
| 7 | Click "+ Add Task" button in calendar header | Navigates to New Task form |

**Pass Criteria:** Calendar renders cleanly, month name correct, events color-coded, navigation works.

---

## Test Path 6: Pipeline Health Check

**Goal:** Sales manager reviews the full pipeline.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/pipeline/` | Columns render with colored top borders |
| 2 | Verify each stage shows lead count badge | Count badge matches number of cards |
| 3 | Check lead cards show formatted value ($X,XXX) | Values formatted with floatformat |
| 4 | Use "Move to stage…" dropdown on a lead | Lead card moves, stage counts update |
| 5 | Scroll horizontally if many stages | No layout overflow, scrolls smoothly |

**Pass Criteria:** Pipeline visually correct, lead cards functional, movement works.

---

## Test Path 7: Kanban Boards

**Goal:** Agent uses a board to track their personal workflow.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/boards/` | Board cards show name, description, column count, updated time |
| 2 | Click "New Board" | New Board form in styled card |
| 3 | Fill: Name="Q2 Follow-ups", Description="High-priority Q2 renewals" | Form validates |
| 4 | Submit | Redirects to board detail |
| 5 | Add a card using the inline "Add a card" input | Card appears in the column |
| 6 | Click "Edit" on a card | Modal opens with styled form (title, description, contact, due date) |
| 7 | Drag a card to another column | Card moves; SortableJS animates |

**Pass Criteria:** Board creation works, cards add/edit, drag-and-drop functional.

---

## Test Path 8: Automation Rules

**Goal:** Agent sets up a trigger so tasks are auto-created when leads advance.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/automations/` | Page shows "Automatically create tasks…" (no plan restriction text) |
| 2 | Click "New Rule" | Styled form in card |
| 3 | Fill: Name="Proposal sent — schedule call", Trigger=any pipeline stage, Action title="Call {contact} — proposal review", Due in=2 days | Form validates |
| 4 | Submit | Rule appears in automations table |
| 5 | Click the Active/Off toggle | Status changes smoothly |
| 6 | Click Edit on the rule | Returns to form pre-filled |
| 7 | Delete the rule | Rule removed from table |

**Pass Criteria:** No plan-gate text, rules create/edit/delete/toggle correctly.

---

## Test Path 9: Document Management

**Goal:** Agent uploads a signed application form for Jane Doe.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/documents/` | Upload form and document table visible |
| 2 | Select Contact=Jane Doe in the link dropdown | Dropdown populates correctly |
| 3 | Choose a file to upload (PDF or image) | File input accepts the file |
| 4 | Submit | Document appears in the table with filename and linked contact |
| 5 | Click the document link | File downloads or opens in new tab |
| 6 | Click Delete | Document removed from table |

**Pass Criteria:** File upload works, document listed with correct metadata, download link works.

---

## Test Path 10: Team & Settings

**Goal:** Agency owner checks account and team configuration.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Settings → Profile | Styled card with avatar initial, name, email |
| 2 | Update display name → Save | Changes reflected immediately in sidebar avatar |
| 3 | Navigate to Settings → Company | Styled card, company name input |
| 4 | Update company name → Save | Name updates in sidebar |
| 5 | Navigate to Settings → Team | Members table and pending invites table visible |
| 6 | Generate invite link with role=Agent | Invite link banner appears with Copy button |
| 7 | Copy link → verify clipboard works | Button says "Copied!" briefly |

**Pass Criteria:** All settings save correctly, team management functional.

---

## Test Path 11: Search & Cross-Navigation

**Goal:** Agent quickly finds a record without knowing where it lives.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Use the search box in the top nav bar | Search input highlighted |
| 2 | Type "Jane" and submit | Results page shows Jane under Contacts |
| 3 | Click Jane's name | Navigates to contact detail |
| 4 | Search for a policy number | Policy appears under Policies column |
| 5 | Search for a task keyword | Task appears under Tasks column |

**Pass Criteria:** Search returns results across all three entity types, results are clickable.

---

## Test Path 12: Dark Mode & Accessibility

**Goal:** Agent works late at night — switches to dark mode.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the moon/sun icon in the header | Page switches to dark mode |
| 2 | Navigate through dashboard, contacts, pipeline | All text readable, no invisible text |
| 3 | Check card borders are visible in dark mode | Borders use `dark:border-slate-700` (not invisible) |
| 4 | Tab through page elements | Focus rings visible on all interactive elements |
| 5 | Switch back to light mode | Page reverts, preference persists on reload |

**Pass Criteria:** Dark mode consistent, no invisible text, focus states visible.

---

## Known Issues Fixed During This Session

| # | Issue | Severity | Fix Applied |
|---|-------|----------|-------------|
| 1 | `contact_form.html` used `{{ form.as_p }}` — unstyled | **Critical** | Rewritten with card layout, grid, proper labels |
| 2 | `task_form.html` used `{{ form.as_p }}` — unstyled | **Critical** | Rewritten with card layout, priority/due side-by-side |
| 3 | `partials/lead_form.html` rendered without `base.html` | **Critical** | Extended base.html, full card layout |
| 4 | `boards/board_form.html` used bare labels, no card | **High** | Rewritten with consistent card pattern |
| 5 | `partials/card_form.html` used `form.as_p` in modal | **High** | Rewritten with labeled sections, btn-primary/secondary |
| 6 | `accounts/org_settings.html` used no design system classes | **High** | Updated to use card, form-label, btn-primary |
| 7 | Calendar showed `5/2026` instead of `May 2026` | **High** | Added `month_name` to context, redesigned calendar |
| 8 | Automations said "Requires Standard or Pro plan" | **High** | Text removed |
| 9 | Dashboard pipeline bars hardcoded gray | **Medium** | Added `color` field to pipeline_data_json |
| 10 | Tasks table: no priority badge, no overdue highlight | **Medium** | Added color-coded badges + red row/date for overdue |
| 11 | Board list: empty `<div>` in header | **Medium** | Replaced with board count + updated_at time |
| 12 | Contact detail: Tasks section had no Add Task button | **Medium** | Added matching "Add task" link (mirrors Policies card) |
| 13 | Confirm-delete pages had no card, no warning icon | **Low** | Styled with red warning card pattern |
| 14 | `contact_form.html`/`task_form.html`: no card wrapper | **Medium** | Fixed |
