# MedCare Dashboard — Project Context for Claude

## Project Overview
A B2B Healthcare SaaS UI built as a take-home assignment for **RagaAI** (sachin.kamat@raga.ai).
Live at: `medcare-dashboard.vercel.app` (pending) | GitHub: `medcare-dashboard` (public repo)

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
│   ├── ui/               — Badge, Button, Card, Input
│   ├── layout/           — Sidebar, Navbar, AppLayout
│   ├── AddPatientModal   — 3-step add patient form
│   ├── NewAppointmentModal — new appointment + conflict detection
│   ├── PatientModal      — patient detail tabs (overview/appts/billing/rx)
│   └── ToastContainer    — toast notification renderer
├── features/
│   ├── auth/             — authSlice.ts
│   ├── appointments/     — appointmentsSlice.ts (addAppointment, updateAppointmentStatus, updateAppointmentChecks)
│   ├── billing/          — billingSlice.ts (updateClaimStatus)
│   ├── patients/         — patientsSlice.ts (addPatient, setSelectedPatient, filters)
│   └── ui/               — uiSlice.ts (theme, sidebar, notifications, toasts)
├── hooks/            — useAppDispatch.ts
├── lib/              — firebase.ts, mockData.ts, notifications.ts, utils.ts
├── pages/            — LoginPage, RegisterPage, DashboardPage, AnalyticsPage,
│                       PatientDetailsPage, AppointmentsPage, BillingPage, ProtectedRoute
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
- **Sidebar**: Floating rounded card (`borderRadius: 20px`, `left: 12px`, `top: 12px`, `height: calc(100vh - 24px)`). Nav item clicks call `document.documentElement.scrollTop = 0` for instant scroll-to-top on route change.
- **Navbar**: Themed pill (`borderRadius: 999px`, uses `var(--bg-card)` + `var(--border-primary)`) — raga.ai inspired, floats at top, respects light/dark theme. Left section shows gradient avatar (user initial) + staggered "Welcome, [name]" animation. Right section: theme toggle + notifications.
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
- Quick stats: Discharged, Recovering, Departments, Doctors, Claim Approval — all use `KpiCard size="sm"`; Discharged + Recovering navigate to filtered patients on click
- "Appointments Today" KPI reads from Redux (reactive to new bookings)
- Critical patients banner: pulsing red border (`alert-pulse`), staggered card entry, avatar radar-ping (`ping-red`), hover x+y lift

### AnalyticsPage (`/analytics`)
- KPI cards with count-up animation
- Bar chart: revenue by month
- Pie chart: patients by department (all 8 departments shown)
- Line chart: appointments vs recovered
- Area chart: patient volume trend
- Financial Breakdown: provider coverage table + top procedures
- Doctor Performance table (dynamic from Redux patients)
- All chart colours: blue/cyan/purple/yellow — no green

### PatientDetailsPage (`/patients`)
- Grid/list view toggle (stored in Redux)
- Search + collapsible filter panel (status pills)
- Add Patient button: gradient (`var(--gradient-primary)`), icon scales 1.2x on button hover via Framer Motion named variant (`whileHover="hover"` + child `motion.span` variants)
- Patient count shows `filteredPatients.length of patients.length`
- Patient modal with vitals, appointments, billing, prescriptions tabs

### AppointmentsPage (`/appointments`)
- Week calendar strip with density badge (count, colour-coded: cyan < 4, yellow 4–5, red ≥ 6)
- Stats cards (Total/Confirmed/Pending/No-Shows) — `KpiCard size="sm"` with `rawValue` (count-up), `active` prop highlights selected filter
- Search input + collapsible filter panel (status + appointment type pills)
- Appointment list sorted by time, with intake + insurance badges
- Inline card status actions: Pending → Confirm / No-show / Cancel; Confirmed → No-show / Cancel
- New Appointment button: gradient (`var(--gradient-primary)`), icon scales 1.2x on hover via named variant propagation
- Doctor schedules sidebar with progress bars
- Action Required sidebar — "Complete Intake" / "Verify Insurance" buttons dispatch Redux directly
- Time slots panel: dynamic from Redux appointments, sorted by time
- Appointment detail modal with "View Patient" action

### BillingPage (`/billing`)
- KPI cards: Total Billed, Insurance Settled, Patient Outstanding, Pending Claims — all from Redux
- 3-column charts row: Provider Performance bar chart | Claim Status donut | Outstanding Balance leaderboard (top 5 by patientDue)
- Billing records: search (patient / doctor / procedure / provider) + collapsible filter (Status pills + Provider pills) + pagination (10/page)
- Click any row → billing detail modal: financial breakdown, claim status update pills (dispatches `updateClaimStatus`), "View Patient Profile" action
- Modal uses `selectedRecordId` + `records.find()` pattern — auto-updates on Redux dispatch without closing

---

## Service Worker & Notifications
Three push notification scenarios:
1. **Welcome** — on login
2. **Critical patient alert** — clicking a Critical status patient
3. **Daily summary** — 5s after dashboard load

---

## Redux State Shape
```ts
store: {
  auth:         { user }
  patients:     { patients[], filteredPatients[], selectedPatient, filterStatus, viewMode, searchQuery }
  appointments: { appointments[] }   // seeded from mockAppointments, mutable via addAppointment
  billing:      { records[] }        // seeded from mockBillingData, mutable via updateClaimStatus
  ui:           { theme, sidebarOpen, notifications[], toasts[] }
}
```

### Key actions
| Slice | Action | Effect |
|---|---|---|
| patients | `addPatient(patient)` | Push + re-apply filters |
| patients | `setSelectedPatient(patient)` | Opens PatientModal globally via AppLayout |
| appointments | `addAppointment(appointment)` | Push; all consumers react immediately |
| appointments | `updateAppointmentStatus({ id, status })` | Updates status in place |
| appointments | `updateAppointmentChecks({ id, intakeComplete?, insuranceVerified? })` | Marks intake/insurance done |
| billing | `updateClaimStatus({ id, status })` | Updates claim status in place |
| ui | `addToast({ message, type })` | Auto-dismissed after 3.5s |

---

## Mock Data
- **20 patients** — all Indian names, realistic diagnoses, departments, doctors
- **12 appointments** — spread across 2026-05-11 to 2026-05-13
- **Doctors**: Dr. Priya Sharma, Dr. Arjun Nair, Dr. Sneha Iyer, Dr. Vikram Rao, Dr. Rahul Gupta, Dr. Meera Pillai
- **Departments**: Cardiology, Neurology, Pulmonology, Endocrinology, Orthopedics, Surgery, Nephrology, etc.
- **metricsData**: 7 months (Nov 2025 – May 2026)
- **departmentStats**: 8 departments with blues/indigos colour palette
- **17 billing records** — covering all major departments and all 7 insurance providers
- `mockAppointments`, `mockPatients`, and `mockBillingData` seed Redux on init — do **not** read them directly in components, always use `useAppSelector`

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
- [ ] Deploy to Vercel (add VITE_* env vars in dashboard)
- [ ] Write README.md
- [ ] Submit GitHub repo + live link + fill RagaAI application form
- [ ] Overdue appointment highlight on cards (explicitly deferred)

## Key Behavioural Rules

### Appointments
- New appointments dispatched via `addAppointment` show up immediately in: AppointmentsPage list + time slots panel, DashboardPage "Appointments Today" KPI, PatientModal appointments tab
- Appointment list and time slots panel are both sorted by `time` (string `localeCompare`)
- Booking is **blocked** when the selected time slot conflicts with an existing doctor or patient appointment — user must pick a conflict-free slot

### NewAppointmentModal conflict detection
- Teams-style horizontal timeline: doctor track (red blocks) + patient track (purple blocks)
- Proposed appointment shown as blue block, turns red on overlap
- Conflict = any overlap between `[slotStart, slotStart+duration)` and an existing appointment's `[start, start+duration)`
- Click anywhere on a track to snap the proposed time to that position (30-min snapping)
- Slot picker buttons show red dot badge + red text for any conflicting slot
- Submit is **disabled** when a conflict exists

### BillingPage modal pattern
- `selectedRecordId: string | null` state; `selectedRecord = records.find(r => r.id === selectedRecordId)`
- Dispatching `updateClaimStatus` updates Redux → `records.find` re-runs on next render → modal reflects new status without closing
- Same ID-based pattern should be used anywhere a detail modal needs to stay open while Redux state updates

### PayloadAction imports in slices
Always use `import { createSlice, type PayloadAction }` — `type` keyword required or Vite throws at runtime because `PayloadAction` has no runtime value.

---

## Competitor Context (for UI inspiration)
- **RagaAI**: Vertical AI agent suites. Key modules: Smart Scheduling, Patient Intake, Revenue Cycle. Stats: 46.5% claim denial reduction, 170% booking growth, 99.9% uptime.
- **Innovaccer**: Horizontal data OS, $250M ARR. Platform: Gravity™ (400+ EHR connectors).
- **Design inspiration**: raga.ai — deep navy, dot-grid bg, floating dark navbar pill, glassmorphism cards.

---

## Animation Patterns

### Hover shift (list rows & sidebar nav)
All interactive rows/items use `whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}` on `motion.div` / `motion.tr`. Sidebar uses pure CSS `transform: translateX(4px)` in SCSS.

### KpiCard hover
- Card lifts `y: -3` via `whileHover`
- Icon scales 1.1× driven by `onHoverStart`/`onHoverEnd` → `useState(hovered)` → `animate={{ scale: hovered ? 1.1 : 1 }}` on inner `motion.div`
- `iconBg={false}` prop suppresses the `${color}18` background box when needed

### Button icon scale (Add Patient / New Appointment)
Named variant propagation: `<motion.button whileHover="hover" initial="rest">` + `<motion.span variants={{ rest: { scale: 1 }, hover: { scale: 1.2 } }}>`. Parent hover state cascades to child automatically.

### Critical patients banner (`globals.css` keyframes)
- `alert-pulse` — slow red glow breathe on the outer container (3s loop)
- `ping-red` — radar-ping ring scaling outward from the avatar (2s loop)

### glass-card shadow
Default shadow `0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)` gives 3D lift. Dark mode: `0 2px 10px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)`. Hover replaces with `var(--glow-blue)` which is more prominent.

### Page entry direction
All page header animations use `initial={{ opacity: 0, y: 10 }}` (slides up). Never use `y: -10` — it makes content appear to fall from above.

### CSS variable + hex-alpha limitation
`${color}18` only works for hex colors (e.g. `#3c83f618`). Silently fails for `var(--accent-red)` etc. Always pass hex values to KpiCard `color` prop when icon background is needed.

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
