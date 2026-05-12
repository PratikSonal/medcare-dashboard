# MedCare — Healthcare Dashboard

A B2B Healthcare SaaS dashboard built as a take-home assignment for RagaAI. Covers patient management, appointment scheduling, billing & claims, and analytics — all in a polished, animated UI with full light/dark theme support.

**Live demo:** [medcare-dashboard.vercel.app](https://medcare-dashboard.vercel.app)

---

## Features

### Dashboard
- Animated KPI cards with count-up numbers (Total Patients, Active Cases, Critical Alerts, Appointments Today, Revenue)
- Patient trend area chart with 3M / 6M / All period toggle
- Critical patients banner with pulsing alert animation and radar-ping avatars
- Today's appointments table with intake & insurance status badges
- Quick stats row: Discharged, Recovering, Departments, Doctors, Claim Approval rate

### Patients
- Grid / list view toggle, persisted in Redux
- Search + collapsible status filter panel
- Add Patient — 3-step modal form (demographics → vitals → insurance)
- Patient detail modal with four tabs: Overview, Appointments, Billing, Prescriptions
- Clicking a Critical patient triggers a native browser notification

### Appointments
- Week calendar strip with colour-coded appointment density badges
- Stats cards (Total / Confirmed / Pending / No-Shows) double as filter toggles
- New Appointment modal with conflict detection — Teams-style horizontal timeline shows doctor and patient tracks; proposed slot turns red on overlap and booking is blocked
- Inline status actions: Confirm / No-show / Cancel directly on each card
- Action Required sidebar for incomplete intake and unverified insurance
- Doctor schedules sidebar with per-doctor confirmation progress bars

### Billing & Revenue
- KPI cards: Total Billed, Insurance Settled, Patient Outstanding, Pending Claims
- Provider Performance stacked bar chart, Claim Status donut, Outstanding Balance leaderboard
- Billing records table — search, multi-filter (status + provider), paginated (10/page)
- Click any row to open a detail modal with financial breakdown and live claim status update (modal stays open while Redux updates)

### Analytics
- 7-month aggregate KPIs: Total Patients, Revenue, Appointments, Recovery Rate
- Revenue bar chart, Department distribution pie chart, Appointments vs Recovered line chart, Patient Volume area chart
- Financial Breakdown: provider coverage table + top 5 procedures
- Doctor Performance table with per-status patient counts

### General
- Firebase Email/Password authentication
- Persistent light / dark theme (localStorage)
- Animated floating sidebar with collapse support
- Navbar with user avatar, welcome animation, notification panel (filter All / Unread, mark read)
- Toast notification system (auto-dismissed after 3.5s)
- Service worker — offline shell caching + push notification listener
- Zero TypeScript errors

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| State | Redux Toolkit (Feature-Sliced Design) |
| Styling | Tailwind v4 + CSS variables + inline styles |
| Auth | Firebase Authentication |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Poppins (Google Fonts) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Email/Password auth enabled

### Setup

```bash
git clone https://github.com/pratiksonal/medcare-dashboard.git
cd medcare-dashboard
npm install
```

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

---

## Environment Variables

All variables are prefixed `VITE_` so Vite exposes them to the client bundle. See [.env.example](.env.example) for the full list.

When deploying to Vercel, add each variable in **Settings → Environment Variables**.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  — KpiCard, Badge, Button, Input, Avatar, SearchInput
│   ├── layout/              — Sidebar, Navbar, AppLayout
│   ├── AddPatientModal/     — 3-step add patient form
│   ├── NewAppointmentModal/ — new appointment + conflict detection timeline
│   ├── PatientModal/        — patient detail tabs
│   └── ToastContainer/      — toast renderer
├── features/
│   ├── auth/                — authSlice
│   ├── appointments/        — appointmentsSlice
│   ├── billing/             — billingSlice
│   ├── patients/            — patientsSlice
│   └── ui/                  — uiSlice (theme, notifications, toasts)
├── lib/                     — firebase, mockData, notifications, utils, constants
├── pages/                   — LoginPage, RegisterPage, DashboardPage, AnalyticsPage,
│                              PatientDetailsPage, AppointmentsPage, BillingPage
├── store/                   — Redux store
├── styles/                  — globals.css (CSS variables, keyframes, glass-card)
└── types/                   — shared TypeScript types
public/
└── sw.js                    — Service Worker
```

---

## Mock Data

The app ships with realistic seed data so no backend is required:

- 20 patients — Indian names, diagnoses across 8 departments, 6 attending doctors
- 12 appointments — spread over 2026-05-11 to 2026-05-13
- 17 billing records — covering all 7 insurance providers
- 7 months of metrics (Nov 2025 – May 2026)
