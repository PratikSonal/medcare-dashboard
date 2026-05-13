# MedCare — Fix Tracker

Issues surfaced from brutal code review. Work top-to-bottom.

---

## P0 — Blocking (Fix Before Anything Else)

- [ ] **No tests exist** — write tests for conflict detection algorithm, billing calculations, filter pipeline (`useCountUp`, `applyFilters`, appointment overlap logic)
- [ ] **Redux reducer has DOM side effects** — `uiSlice.ts` calls `document.documentElement.setAttribute` and reads `localStorage` inside the reducer. Move to RTK listener middleware or a top-level `useEffect` watching the theme selector.

---

## P1 — Critical Architecture

- [ ] **Mock data imported directly in components** — `PatientModal` imports `mockBillingData` and `mockPrescriptions` raw. Route everything through Redux; components read from the store only.
- [ ] **`billingRecords[0]` null crash** — `PatientModal` accesses index 0 with no guard. Add null check or optional chaining.
- [ ] **Split `PatientModal` (250+ lines)** — extract each tab (Overview, Appointments, Billing, Prescriptions) into its own component.
- [ ] **Split `AddPatientModal` (250+ lines)** — extract `StepIndicator`, per-step field groups, and validation into separate components.
- [ ] **Split `AuthForm` (150+ lines)** — separate Firebase auth logic into a `useFirebaseAuth` hook; keep the component presentational.
- [ ] **Deduplicate error message maps** — `AuthForm` and `RegisterCard` both define Firebase error → human message maps. Extract to `src/lib/errorMessages.ts`.
- [ ] **Deduplicate validation logic** — same email regex lives in both auth components. Extract to `src/lib/validators.ts`.
- [ ] **Deduplicate status color logic** — defined in `lib/constants.ts`, `lib/utils.ts`, `PatientModal/constants.ts`, and `AppointmentsPage/statusConfig.tsx`. One source of truth only.

---

## P2 — High Quality Issues

- [ ] **Unsafe Firebase error casting** — `err as { code?: string }` bypasses the type system. Replace with `FirebaseError` from `firebase/app` + `instanceof` narrowing in both `AuthForm` and `RegisterCard`.
- [ ] **Derived state belongs in selectors** — `totalBilled`, `approvalRate`, filtered appointment lists, doctor rosters are computed in component bodies with `useMemo`. Move to `createSelector` (RTK) so every consumer gets the memoized result without duplicating dependency arrays.
- [ ] **`serializableCheck: false` in store** — this disables a critical RTK guard. Identify what non-serializable value is triggering it (likely a Firebase `User` object or a `Date`) and fix the root cause.
- [ ] **Add Error Boundaries** — no `ErrorBoundary` exists anywhere. One bad render (malformed chart data, bad mock entry) crashes the entire app to a white screen. Add at app root and around modal/chart-heavy pages.
- [ ] **Fix all missing accessibility attributes** — Navbar bell + theme toggle have no `aria-label`. PatientModal tabs need `aria-selected` + `aria-controls`. Password toggle in AuthForm needs an accessible label. Modals need focus trap and focus restoration on close.
- [ ] **Deduplicate time formatting helpers** — `AppointmentsPage/helpers.ts` and `NewAppointmentModal/helpers.ts` both implement time formatting. Consolidate into `src/lib/utils.ts`.

---

## P2 — Colour Token Gaps (partially addressed)

- [ ] **`rgba` alpha variants are still hardcoded** — `rgba(60,131,246,0.1)`, `rgba(14,165,233,0.12)`, `rgba(239,68,68,0.35)`, etc. appear throughout components and constants. The design system has no alpha-channel tokens. Add `--accent-blue-subtle`, `--accent-cyan-subtle`, `--accent-red-subtle`, `--accent-yellow-subtle`, `--accent-purple-subtle` CSS variables (at 10–12% opacity) and replace all inline `rgba(...)` background/border values.
- [ ] **Design-system gaps in chart/dept colours** — `#38bdf8` (Orthopedics), `#6366f1` (Surgery/PROC_COLORS), `#a78bfa` (Nephrology), `#6b7280` (Others) are used in `departmentStats.ts`, `mockData.ts`, and `AnalyticsPage/constants.ts` with no corresponding CSS variable. Add them to the design system or replace with existing tokens.
- [ ] **`RegisterPage` bypasses the design system entirely** — `RegisterCard.tsx` and `RegisterPage/index.tsx` use ~25 raw hex values (`#070d1a`, `#0d1b33`, `#1e3a5f`, `#2563eb`, `#fca5a5`, etc.) that have no CSS variable equivalents. This page needs to be migrated to the same dark-mode token system used by `LoginPage`.
- [ ] **`LoginPage/LeftPanel.tsx` has residual dark-only hex values** — `#0c111d`, `#1d2839`, `#4b5563`, `#f8fafc`, `#9ca3af` are hardcoded because the panel is always rendered dark regardless of theme. These should map to the dark-mode CSS var values (`--bg-secondary`, `--border-primary`, etc.) and be expressed as `var(--x)` so a future theme change doesn't require revisiting.

---

## P3 — Import Order & Naming

- [ ] **Install `eslint-plugin-simple-import-sort`** — automates import ordering so violations are caught at lint time. Add to `eslint.config.js` with rules `simple-import-sort/imports` and `simple-import-sort/exports`, then run `eslint --fix` once to sort all files. Enforced order: (1) React, (2) third-party, (3) `@/hooks` → `@/lib` → `@/components`, (4) relative, (5) `import type` last.
- [ ] **`RegisterPage/components/RegisterCard.tsx` import order** — Firebase auth imports, local `@/lib/firebase`, hooks, and features are interleaved rather than grouped. Defer until `simple-import-sort` is installed so the fix is automated.
- [ ] **`AnalyticsPage/components/ChartsRow.tsx` import order** — lucide-react appears after a block of recharts imports; should be grouped with all third-party libraries first.

---

## P3 — Technical Debt

- [ ] **`patientsSlice.isLoading` is dead state** — the `isLoading` field exists in `PatientsState` but is never set by any reducer action and never read by any consumer. Either wire it up to actual async data fetching or remove it entirely.
- [ ] **Hardcoded demo date `"2026-05-11"`** — appears in `AppointmentsPage/index.tsx` (×2), `DashboardPage/index.tsx`, and `AppointmentsTable.tsx`. Extract to a shared constant (`src/lib/constants.ts`) as `TODAY_DEMO_DATE` so all filter comparisons reference one place.
- [ ] **Fragile ID generation in `AddPatientModal`** — `Math.max(...patients.map(p => parseInt(p.id.slice(1))))` silently returns `NaN` on format mismatch, `-Infinity` on empty array, and stack overflows at scale. Replace with `crypto.randomUUID()`.
- [ ] **Module-scope calculations in `DashboardPage`** — some derived values execute at import time by reading `mockBillingData` directly at the top level. Move inside the component or into selectors.
- [ ] **`inputCls` helper defined inside component body** — in `AddPatientModal`, re-defined on every render. Move outside the component.
- [ ] **Unused Firebase Analytics import** — `getAnalytics` imported in `firebase.ts` but never used.
- [ ] **`helper.tsx` vs `helpers.ts` inconsistency** — `AnalyticsPage` uses `.tsx` extension for a file with no JSX. Standardise to `.ts`.
- [ ] **Single-letter variable names** — `k` (KPI), `t` (tab), `f` (form state) used across pages. Spell them out.

---

## Completed

_Nothing yet._
