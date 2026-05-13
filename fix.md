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

## P3 — Technical Debt

- [ ] **Fragile ID generation in `AddPatientModal`** — `Math.max(...patients.map(p => parseInt(p.id.slice(1))))` silently returns `NaN` on format mismatch, `-Infinity` on empty array, and stack overflows at scale. Replace with `crypto.randomUUID()`.
- [ ] **Module-scope calculations in `DashboardPage`** — some derived values execute at import time by reading `mockBillingData` directly at the top level. Move inside the component or into selectors.
- [ ] **`inputCls` helper defined inside component body** — in `AddPatientModal`, re-defined on every render. Move outside the component.
- [ ] **Unused Firebase Analytics import** — `getAnalytics` imported in `firebase.ts` but never used.
- [ ] **`helper.tsx` vs `helpers.ts` inconsistency** — `AnalyticsPage` uses `.tsx` extension for a file with no JSX. Standardise to `.ts`.
- [ ] **Single-letter variable names** — `k` (KPI), `t` (tab), `f` (form state) used across pages. Spell them out.

---

## Completed

_Nothing yet._
