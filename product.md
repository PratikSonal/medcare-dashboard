# MedCare Dashboard — Project Context for Claude

## Project Overview
A B2B Healthcare SaaS UI built as a take-home assignment for **RagaAI** (sachin.kamat@raga.ai).
Live at: `medcare-dashboard.vercel.app` (pending) | GitHub: `medcare-dashboard` (public repo)

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| State | Redux Toolkit (Feature-Sliced Design) |
| Styling | Tailwind v3 (`@tailwind base/components/utilities`) + CSS custom properties |
| Validation | Zod (`loginSchema`, `registerSchema` in `src/lib/validators.ts`) |
| Auth | Firebase Authentication (Email/Password) via `useAuth` hook |
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
│   ├── ui/               — Badge, Button, Card, Input, AuthInput, KpiCard, Avatar, SearchInput, PageLoader
│   ├── layout/
│   │   ├── AppLayout/    — authenticated shell (sidebar + navbar + outlet)
│   │   ├── LoginLayout/  — unauthenticated shell (LeftPanel + slot); used by LoginPage + RegisterPage
│   │   │   ├── index.tsx
│   │   │   ├── LeftPanel.tsx
│   │   │   ├── constants.ts  — carousel slides data
│   │   │   └── types.ts      — Slide interface
│   │   ├── Navbar/
│   │   └── Sidebar/
│   ├── modal/
│   │   ├── AddPatientModal/      — 3-step add patient form
│   │   │   ├── index.tsx         — orchestration shell (~130 lines)
│   │   │   ├── Field.tsx         — reusable label+error wrapper
│   │   │   ├── StepIndicator.tsx — step progress dots
│   │   │   ├── steps/
│   │   │   │   ├── Step0Personal.tsx   — name/age/gender/blood/phone/email/address
│   │   │   │   ├── Step1Clinical.tsx   — status pills (StatusPill sub-component), diagnosis, department, doctor, dates
│   │   │   │   └── Step2Vitals.tsx     — HR/BP/temp/O₂/weight + patient ID preview
│   │   │   ├── helpers.ts        — validateStep, buildPatient, getNextId, getInputCls
│   │   │   ├── constants.ts      — DEPARTMENTS, DOCTORS, STATUSES, STATUS_COLORS (derived from PATIENT_STATUS_COLORS)
│   │   │   └── types.ts          — FormData, FieldProps, AddPatientModalProps, StepProps
│   │   ├── NewAppointmentModal   — appointment + conflict detection (DurationButton, SlotButton sub-components)
│   │   └── PatientModal/         — patient detail viewer
│   │       ├── index.tsx         — shell with header + tabs (~150 lines)
│   │       ├── tabs/
│   │       │   ├── OverviewTab.tsx      — vitals grid (VitalBadge), contact, diagnosis cards
│   │       │   ├── AppointmentsTab.tsx  — appointment cards with status+type badges
│   │       │   ├── BillingTab.tsx       — insurance details + billing records list
│   │       │   └── PrescriptionsTab.tsx — prescription cards with refill indicators
│   │       ├── constants.ts      — PRESCRIPTION_COLORS
│   │       └── types.ts          — Props, TabId, VitalBadgeProps
│   └── ToastContainer    — toast notification renderer
├── features/
│   ├── auth/             — authSlice.ts
│   ├── appointments/     — appointmentsSlice.ts
│   ├── billing/          — billingSlice.ts
│   ├── patients/         — patientsSlice.ts (includes prescriptions[] state)
│   └── ui/               — uiSlice.ts (theme, sidebar, notifications, toasts; reducers are pure — no DOM side effects)
├── hooks/
│   ├── useAppDispatch.ts — typed Redux hooks
│   ├── useAuth.ts        — full Firebase auth implementation (signIn, register, isLoading, error, clearError; exports UseAuthReturn interface)
│   ├── useCountUp.ts     — animated number counter
│   └── useThemeSync.ts   — useEffect watching s.ui.theme; applies localStorage + data-theme attribute outside of Redux reducers
├── lib/
│   ├── errorMessages.ts  — Firebase error code → human string map
│   ├── firebase.ts       — Firebase app init
│   ├── mockData.ts       — seed data for Redux slices
│   ├── notifications.ts  — push notification helpers
│   ├── utils.ts          — cn(), formatDate(), status color helpers
│   └── validators.ts     — Zod schemas (loginSchema, registerSchema)
├── pages/
│   ├── LoginPage/        — LoginLayout + LoginForm
│   ├── RegisterPage/     — LoginLayout + RegisterForm
│   ├── DashboardPage, AnalyticsPage, PatientDetailsPage, AppointmentsPage, BillingPage
│   └── ProtectedRoute/   — Firebase auth state guard
├── routes/           — AppRouter (lazy page imports, BrowserRouter)
├── store/            — Redux store config
├── styles/           — globals.css (CSS variables, keyframes, utility classes)
└── types/            — shared TypeScript types
public/sw.js          — Service Worker (push notifications)
```

---

## Design System

### Theme
- **Default**: Light mode
- **Toggle**: State lives in `uiSlice`; side effects (localStorage + `data-theme` attribute) handled by `useThemeSync` hook in `AppLayout`, not inside the reducer
- **Initial load**: `uiSlice.ts` module scope reads `localStorage` and sets `data-theme` synchronously before React hydrates (prevents FOUC)
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
- **Tailwind v3** for all static values — arbitrary values like `w-[400px]`, `grid-cols-[1fr_320px]`, `shadow-[...]`, `max-h-[calc(100vh-48px)]` all work correctly (spaces → underscores inside `[]`)
- **Inline styles only for dynamic runtime values**: computed colors (`` `${color}18` ``), gradient CSS variables (`var(--gradient-primary)`), runtime-calculated positions/widths (progress bars, carousel dot widths, pointer-event positioning)
- CSS variables for all design tokens so light/dark mode works automatically
- Dot-grid background: `radial-gradient(circle, rgba(...) 1px, transparent 1px)` — applied via `.dot-grid` utility class in `globals.css`

### Layout
- **Sidebar**: Floating rounded card (`borderRadius: 20px`, `left: 12px`, `top: 12px`, `height: calc(100vh - 24px)`). Nav item clicks call `document.documentElement.scrollTop = 0` for instant scroll-to-top on route change. **Mobile drawer** (< 640px): slides in from the left via `translate-x-0` / `-translate-x-[calc(100%+16px)]`, controlled by Redux `sidebarOpen` (defaults `false`). `sm:translate-x-0` forces it always-visible on desktop regardless of Redux state. A `bg-black/50 backdrop-blur-sm sm:hidden` overlay covers content when open on mobile.
- **Navbar**: Themed pill (`borderRadius: 999px`, uses `var(--bg-card)` + `var(--border-primary)`) — raga.ai inspired, floats at top, respects light/dark theme. Left section shows gradient avatar (user initial) + staggered "Welcome, [name]" animation + hamburger button (`Menu` icon, `sm:hidden`) that toggles `sidebarOpen`. Right section: theme toggle + notifications.
- **AppLayout**: Main content uses `ml-0 sm:ml-[264px]` (no margin on mobile — sidebar overlays; fixed margin on desktop). `<Outlet />` is wrapped in a nested `<Suspense fallback={<PageLoader />}>` so page transitions show a gradient arc spinner without unmounting the Sidebar/Navbar.

### Auth Architecture
- `useAuth.ts` is the full Firebase auth implementation — owns all Firebase calls (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `updateProfile`), `isLoading` local state, and error mapping via `getFirebaseErrorMessage()`. Exports a `UseAuthReturn` interface documenting the public contract (`signIn`, `register`, `isLoading`, `error`, `clearError`). Components import only from `useAuth`; swapping Firebase for Clerk/Auth0/Supabase means rewriting this one file.
- Redux `authSlice` receives the error string via `dispatch(setError(msg))` but loading is **not** tracked in Redux — form-submit loading lives in local state only (avoids the "stuck-true" bug where `setLoading(true)` was called but the `finally` block never ran).
- `LoginLayout` is the unauthenticated shell: `<LeftPanel />` (always dark, private to `LoginLayout`) + a right-side children slot. Both `LoginPage` and `RegisterPage` compose it.
- `AuthInput` (`src/components/ui/AuthInput/`) — generic labeled input with `htmlFor`/`id` a11y pairing, `icon`, `headerRight` (for "Forgot password?"), and `rightElement` (for show/hide toggle) slots.
- Zod schemas in `src/lib/validators.ts`: `loginSchema` (email + password), `registerSchema` extends `loginSchema` with `name`. Both forms call `schema.safeParse()` before submitting; `result.error.issues[0].message` surfaces the first validation error.

### Login Page
- **Left panel**: Always dark (`#0c111d`) regardless of theme — the 5 remaining hex color values (`#0c111d`, `#1d2839`, `#f8fafc`, `#9ca3af`, `#4b5563`) are intentional (panel is always dark; tracked for CSS var migration in fix.md P2)
- **Right panel**: Follows theme (uses CSS vars)
- **Layout**: Three-zone flex — logo pinned top, content centred (`flex: 1`), compliance pinned bottom
- **Carousel**: 6 slides, 3s auto-advance, fixed `h-[120px]` container with `overflow-hidden` to prevent layout shift. Dot buttons are extracted as a `DotButton` memo sub-component (required because `useCallback` cannot be called inside `.map()`); parent passes a stable `handleDotClick: (index: number) => void` callback.
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
- Composes `LoginLayout` (dark left carousel + themed right slot) + `LoginForm`
- `LoginLayout` is the shared unauthenticated shell; `LeftPanel` is a private implementation detail inside it
- `LoginForm`: email + password, Zod validation (`loginSchema`), show/hide password, "Forgot password?" button (currently unimplemented — tracked in fix.md P1)
- Auth handled by `useAuth()` → `useFirebaseAuth` → `signInWithEmailAndPassword`; errors mapped via `getFirebaseErrorMessage()` in `src/lib/errorMessages.ts`

### RegisterPage (`/register`)
- Same split-panel layout as LoginPage — composes `LoginLayout` (dark left carousel + themed right slot)
- Right panel: `RegisterForm` — name + email + password fields, Zod validation (`registerSchema`), show/hide password toggle
- Creates Firebase user + sets `displayName` via `updateProfile`
- Form structure mirrors `LoginForm`; both use `useAuth()` → `useFirebaseAuth`

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
  patients:     { patients[], prescriptions[], filteredPatients[], selectedPatient, filterStatus, viewMode, searchQuery }
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
- **26 prescriptions** — covers P001–P020 patients with realistic medications, dosages, and frequencies
- `mockAppointments`, `mockPatients`, `mockBillingData`, and `mockPrescriptions` all seed Redux on init — do **not** read them directly in components, always use `useAppSelector`

---

## Status Colours

**Patient status** — single source of truth in `src/features/patients/utils.ts`:
```ts
PATIENT_STATUS_COLORS: {
  Active:     { color: "var(--accent-cyan)",    bg: "rgba(14, 165, 233, 0.1)" }
  Critical:   { color: "var(--accent-red)",     bg: "rgba(239, 68, 68, 0.1)" }
  Recovering: { color: "var(--accent-yellow)",  bg: "rgba(245, 158, 11, 0.1)" }
  Discharged: { color: "var(--text-tertiary)",  bg: "rgba(107, 114, 128, 0.1)" }
}
// Backwards-compatible helpers:
getStatusColor(status) → color string
getStatusBg(status)    → bg string
```
`AddPatientModal/constants.ts` `STATUS_COLORS` derives from `PATIENT_STATUS_COLORS[*].color`.

**Appointment status** — `src/features/appointments/constants.ts` (`APPT_STATUS_COLORS`)
**Claim status** — `src/features/billing/constants.ts` (`CLAIM_STATUS_COLORS`)
**Prescription status** — `src/components/modal/PatientModal/constants.ts` (`PRESCRIPTION_COLORS`)

---

## Pending / Next Steps
- [ ] Deploy to Vercel (add VITE_* env vars in dashboard)
- [x] Write README.md
- [x] Add .env.example
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

### `type="button"` on all non-submit buttons
Every `<button>` that is not a form submit must have `type="button"`. Without it, clicking any button inside a `<form>` triggers form submission. This applies to close buttons in modals, toggle buttons, filter pills, action buttons, etc. Only `<Button type="submit">` should omit it.

### PayloadAction imports in slices
Always use `import { createSlice, type PayloadAction }` — `type` keyword required or Vite throws at runtime because `PayloadAction` has no runtime value.

---

## Competitor Context (for UI inspiration)
- **RagaAI**: Vertical AI agent suites. Key modules: Smart Scheduling, Patient Intake, Revenue Cycle. Stats: 46.5% claim denial reduction, 170% booking growth, 99.9% uptime.
- **Innovaccer**: Horizontal data OS, $250M ARR. Platform: Gravity™ (400+ EHR connectors).
- **Design inspiration**: raga.ai — deep navy, dot-grid bg, floating dark navbar pill, glassmorphism cards.

---

## Performance Architecture

### Memoization rules (applied codebase-wide)
- **Every exported component** is wrapped with `React.memo(...)`. `forwardRef` components use `memo(forwardRef(...))` (e.g. `Button`, `Input`).
- **Every handler** defined inside a component body is wrapped with `useCallback` with correct deps. Exception: inline `style` helper functions like `inputCls` / `fieldCls` that close over `errors` state and are called inline (not passed as props) — these are not memoized.
- **`.map()` items that own dispatch calls** are extracted as dedicated `memo`-wrapped sub-components so `useCallback` is valid inside them (hooks cannot be called inside loops). Established sub-components:
  - `NotificationItem`, `FilterTab` — Navbar
  - `DotButton` — LeftPanel carousel dots
  - `TabButton` — PatientModal tab bar
  - `StatusPill` — AddPatientModal/Step1Clinical status pills
  - `VitalBadge` — PatientModal/OverviewTab vitals grid
  - `DurationButton`, `SlotButton` — NewAppointmentModal
  - `RecentPatientRow` — TrendsRow (DashboardPage)
  - `AppointmentRow` — AppointmentsTable (DashboardPage)
  - `CriticalPatientCard` — CriticalBanner (DashboardPage)
  - `AppointmentCard`, `ActionItem` — AppointmentList / ActionRequired (AppointmentsPage)
  - `PatientCard`, `PatientListRow` — PatientGrid / PatientListView (PatientDetailsPage)

### Prop threading pattern for card components
`PatientCard` and `PatientListRow` use `onPatientClick: (patient: Patient) => void` (not `onClick: () => void`). The parent creates one stable `useCallback` that accepts a patient argument; the card calls it with its own patient prop. This makes `React.memo` on the card effective — the callback reference is stable even as the list re-renders.

### NewAppointmentModal computed values
All derived scheduling data is memoized:
- `docBusy`, `patBusy` — filtered appointment lists by doctor/patient+date
- `doctors` — deduplicated doctor list from appointments
- `selConflict` — conflict check for the currently selected time
- `slotConflicts` — `Record<string, boolean>` mapping every slot to its conflict state; computed once and passed down to each `SlotButton`

---

## Testing

**Framework**: Jest + ts-jest + jsdom (`jest.config.cjs`, `tsconfig.test.json`)
**Run**: `npm test` (all suites) | `npm run test:watch` (watch mode)

| Suite | File | What it covers |
|---|---|---|
| Conflict detection | `NewAppointmentModal/helpers.test.ts` | `t2m`, `minToTime` (round-trip), `getConflict` (before/after/abut/overlap/contains/simultaneous) — 8 cases |
| Filter pipeline | `features/patients/patientsSlice.test.ts` | `applyFilters` via `setSearchQuery`, `setFilterStatus`, `setFilterDepartment`, `clearFilters`, AND-logic combining filters — 8 cases |
| Count-up hook | `hooks/useCountUp.test.ts` | starts at 0, reaches target, increments progressively, reset on target change, cleanup on unmount — 6 cases |

**Test tsconfig** (`tsconfig.test.json`): extends app config, overrides `module: "commonjs"` + `moduleResolution: "node"` to satisfy ts-jest in CJS mode (project uses `"type": "module"` in package.json but tests run via CJS transform).

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

### Tailwind v3 arbitrary values
Arbitrary values work correctly — use them freely: `w-[400px]`, `grid-cols-[1fr_320px]`, `gap-[14px]`, `text-[26px]`, etc. Spaces inside brackets must be underscores: `grid-cols-[1fr_320px]` not `grid-cols-[1fr 320px]`. Inline styles are reserved for values computed at runtime (props, state, event coordinates).

### Theme on login left panel
The login left panel hardcodes dark hex values directly — **do not change these to CSS variables** or the panel will switch with the theme. The intent is: left panel always dark, right panel follows theme.

### localStorage theme
On first load, theme defaults to `'light'` (set in `uiSlice.ts`). If testing, clear localStorage:
```js
localStorage.removeItem('medcare-theme')
```

### Mobile responsiveness (sm = 640px)
- All responsive breakpoints use `sm:` (640px). Default (no prefix) = mobile, `sm:` = desktop override.
- **Sidebar default `sidebarOpen: false`** is intentional — the `sm:translate-x-0` Tailwind class keeps it always-visible on desktop via CSS, not Redux state.
- Modals use `items-end sm:items-center` + `rounded-t-[24px] sm:rounded-[24px]` — sheet sliding up from bottom on mobile, centered dialog on desktop.
- Grid layouts use `grid-cols-1 sm:grid-cols-N` throughout (KPI cards, charts rows, appointment panels).
- Mobile layout refinement is deferred — rough pass is in place; final polish before submission.

### PageLoader
`src/components/ui/PageLoader/` — gradient arc spinner using `conic-gradient` + `radial-gradient` mask (CSS-only ring, no SVG). Used as the Suspense fallback inside `AppLayout` for page transitions. Avoids the flash caused by the outer `fallback={null}` Suspense which would unmount Sidebar/Navbar on every navigation.
