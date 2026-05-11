# MedCare Dashboard — Project Context for Claude

## Project Overview
A B2B Healthcare SaaS UI built as a take-home assignment for **RagaAI** (sachin.kamat@raga.ai).
Live at: `pratiksonal.github.io` | GitHub: `medcare-dashboard` (public repo)

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | React + TypeScript + Vite |
| State | Redux Toolkit (Feature-Sliced Design) |
| Styling | Tailwind v4 + inline styles (Tailwind scanning unreliable in v4) |
| Auth | Firebase Authentication (Email/Password) |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Poppins (Google Fonts, loaded in index.html) |

---

## Project Location
```
/Users/pratiksonal/Desktop/workspace/medcare
```

---

## Folder Structure
```
src/
├── components/
│   ├── ui/           — Badge, Button, Card, Input
│   └── layout/       — Sidebar, Navbar, AppLayout
├── features/
│   ├── auth/         — authSlice.ts
│   ├── patients/     — patientsSlice.ts
│   └── ui/           — uiSlice.ts (theme, sidebar, notifications)
├── hooks/            — useAppDispatch.ts
├── lib/              — firebase.ts, mockData.ts, notifications.ts, utils.ts
├── pages/            — LoginPage, RegisterPage, DashboardPage, AnalyticsPage,
│                       PatientDetailsPage, AppointmentsPage, ProtectedRoute
├── store/            — index.ts
├── styles/           — globals.css
└── types/            — index.ts
public/sw.js          — Service Worker (push notifications)
```

---

## Design System

### Theme
- **Default**: Light mode
- **Toggle**: Persisted to `localStorage` via `uiSlice`
- **Dark mode**: Triggered by `[data-theme="dark"]` on `<html>`

### CSS Variables (Light mode = `:root`, Dark = `[data-theme="dark"]`)
```css
/* Backgrounds */
--bg-primary, --bg-secondary, --bg-tertiary, --bg-card

/* Accents */
--accent-blue: #3c83f6
--accent-cyan: #0ea5e9
--accent-purple: #7c3bed
--accent-yellow: #f59e0b
--accent-red: #ef4444
--accent-green: #10bc83   /* kept for status badges only */

/* Gradient (brand signature) */
--gradient-primary: linear-gradient(135deg, #3c83f6, #0ea5e9)

/* Text */
--text-primary, --text-secondary, --text-tertiary
```

### Colour Rules
- **Active/status badge**: cyan `#0ea5e9` (not green)
- **Charts**: blue `#3c83f6` + cyan `#0ea5e9` (no green in charts)
- **Gradient**: blue → cyan only (green was removed — looked cartoonish)
- **Department chart colours**: blues/indigos/purples palette only

---

## Key Decisions

### Styling
- Use **inline styles throughout** — Tailwind v4 arbitrary values are unreliable
- CSS variables for all design tokens so light/dark mode works automatically
- Dot-grid background: `radial-gradient(circle, rgba(...) 1px, transparent 1px)`

### Layout
- **Sidebar**: Floating rounded card (`borderRadius: 20px`, `left: 12px`, `top: 12px`, `height: calc(100vh - 24px)`)
- **Navbar**: Themed pill (`borderRadius: 999px`, uses `var(--bg-card)` + `var(--border-primary)`) — raga.ai inspired, floats at top, respects light/dark theme
- **AppLayout**: `marginLeft` animates with sidebar open/closed state

### Login Page
- **Left panel**: Always dark (`#0c111d`) regardless of theme — hardcoded hex values, not CSS vars
- **Right panel**: Follows theme (uses CSS vars)
- **Layout**: Three-zone flex — logo pinned top, content centred (`flex: 1, justifyContent: center`), compliance pinned bottom
- **Carousel**: 6 slides, 3s auto-advance, fixed height `120px` container with `overflow: hidden` to prevent layout shift
- **Carousel design**: Large raw icon (56px, no box) left-aligned + stat + headline + description
- **Compliance line**: `HIPAA Certified · SOC 2 Type II · FHIR Ready` — dot-separated, rendered `<span>` circles (not Unicode)

---

## Firebase
- Project: `medcare-dashboard`
- Auth: Email/Password enabled
- **API key in `.env` only** — never committed
- `firebase.ts` uses `import.meta.env.VITE_FIREBASE_*`
- `.env` is in `.gitignore`

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=medcare-dashboard.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medcare-dashboard
VITE_FIREBASE_STORAGE_BUCKET=medcare-dashboard.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=267133596195
VITE_FIREBASE_APP_ID=1:267133596195:web:6cfe5e4dffa4cb85ce7796
VITE_FIREBASE_MEASUREMENT_ID=G-VRL533H0TN
```

> When deploying to Vercel, add all `VITE_*` vars in Vercel dashboard → Settings → Environment Variables.

---

## Pages

### LoginPage (`/login`)
- Split panel: dark left (carousel) + themed right (form)
- Carousel: 6 feature slides, 3s interval, fixed-height animated container
- Form: email + password, Firebase auth, error states, show/hide password

### RegisterPage (`/register`)
- Centered card layout
- Creates Firebase user + sets `displayName`
- Same colour tokens as login right panel

### DashboardPage (`/dashboard`)
- Animated stat counters (count-up on mount)
- Area chart: patients vs recovered (blue + cyan)
- Recent patients list + full table
- Quick stats: Discharged, Recovering, Departments, Doctors

### AnalyticsPage (`/analytics`)
- Bar chart: revenue by month
- Pie chart: patients by department
- Line chart: appointments vs recovered
- Area chart: patient volume trend
- All chart colours: blue/cyan/purple/yellow — no green

### PatientDetailsPage (`/patients`)
- Grid/list view toggle (stored in Redux)
- Search + filter by status
- Patient modal with vitals

### AppointmentsPage (`/appointments`)
- Week calendar strip
- Appointment list with intake + insurance badges
- Doctor sidebar with schedule progress
- Time slot grid + detail modal

---

## Service Worker & Notifications
Three push notification scenarios:
1. **Welcome** — on login
2. **Critical patient alert** — clicking a Critical status patient
3. **Daily summary** — 5s after dashboard load

---

## Mock Data
- **20 patients** — all Indian names, realistic diagnoses, departments, doctors
- **Doctors**: Dr. Priya Sharma, Dr. Arjun Nair, Dr. Sneha Iyer, Dr. Vikram Rao, Dr. Rahul Gupta, Dr. Meera Pillai
- **Departments**: Cardiology, Neurology, Pulmonology, Endocrinology, Orthopedics, Surgery, Nephrology, etc.
- **metricsData**: 7 months (Nov 2025 – May 2026)
- **departmentStats**: 8 departments with blues/indigos colour palette

---

## Status Colours (`utils.ts`)
```ts
Active     → cyan   #0ea5e9  / rgba(14,165,233,0.1)
Critical   → red    var(--accent-red)
Recovering → yellow var(--accent-yellow)
Discharged → gray   var(--text-tertiary)
```

---

## Pending / Next Steps
- [ ] Fix remaining internal page components (dashboard, analytics, patients, appointments) for light mode
- [ ] Deploy to Vercel (add VITE_* env vars in dashboard)
- [ ] Write README.md
- [ ] Submit GitHub repo + live link + fill RagaAI application form

---

## Competitor Context (for UI inspiration)
- **RagaAI**: Vertical AI agent suites. Key modules: Smart Scheduling, Patient Intake, Revenue Cycle. Stats: 46.5% claim denial reduction, 170% booking growth, 99.9% uptime.
- **Innovaccer**: Horizontal data OS, $250M ARR. Platform: Gravity™ (400+ EHR connectors).
- **Design inspiration**: raga.ai — deep navy, dot-grid bg, floating dark navbar pill, glassmorphism cards.

---

## Common Gotchas

### str_replace unreliable on this project
VS Code reformats files on save (Prettier). After any file write, the exact whitespace changes — making `str_replace` fail. **Always do full file rewrites** for files that have been recently edited. For single-value changes, use terminal `sed` instead:
```bash
sed -i "" "s/oldValue/newValue/" src/pages/LoginPage.tsx
```

### Tailwind v4 scanning
Do not use Tailwind arbitrary values like `w-[400px]`. Use inline styles for all custom sizing. Tailwind is only used for the base reset and responsive utilities like `lg:flex`.

### Theme on login left panel
The login left panel hardcodes dark hex values directly — **do not change these to CSS variables** or the panel will switch with the theme. The intent is: left panel always dark, right panel follows theme.

### localStorage theme
On first load, theme defaults to `'light'` (set in `uiSlice.ts`). If testing, clear localStorage:
```js
localStorage.removeItem('medcare-theme')
```
