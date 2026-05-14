# MedCare — Fix Tracker

Issues surfaced from brutal code review. Work top-to-bottom.

---

## P0 — Blocking (Fix Before Anything Else)

- [x] **No tests exist** — Jest configured (`jest.config.cjs`, `tsconfig.test.json`); 27 tests across 3 suites: `NewAppointmentModal/helpers.test.ts` (conflict detection: `t2m`, `minToTime`, `getConflict` — 8 cases), `patientsSlice.test.ts` (`applyFilters` via `setSearchQuery`/`setFilterStatus`/`setFilterDepartment`/`clearFilters` — 8 cases), `useCountUp.test.ts` (count-up lifecycle, reset on target change, cleanup — 6 cases). Run with `npm test`.
- [x] **Redux reducer has DOM side effects** — removed `localStorage.setItem` and `document.documentElement.setAttribute` from `toggleTheme` and `setTheme` reducers. Created `src/hooks/useThemeSync.ts` (`useEffect` watching `s.ui.theme`, applies both side effects). Called in `AppLayout`. Module-scope `setAttribute` in `uiSlice.ts` kept for initial FOUC prevention only.

---

## P1 — Critical Architecture

- [x] **Mock data imported directly in components** — `mockPrescriptions` added to `patientsSlice` state (`prescriptions: Prescription[]`); `PatientModal` now reads both billing records (`s.billing.records`) and prescriptions (`s.patients.prescriptions`) from Redux; `mockBillingData` and `mockPrescriptions` imports removed from `PatientModal`.
- [x] **`billingRecords[0]` null crash** — `PatientModal` assigns `billingRecords[0]` to `billing` and the entire billing tab renders `{billing ? (...) : <empty state>}` — fully guarded.
- [x] **Split `PatientModal` (250+ lines)** — extracted 4 tab components under `PatientModal/tabs/`: `OverviewTab` (patient info grid, vitals, contact), `AppointmentsTab` (appointment list with status+type badges), `BillingTab` (insurance details + billing history), `PrescriptionsTab` (prescription list with refills). `PatientModal/index.tsx` is now ~150 lines (shell only).
- [x] **Split `AddPatientModal` (250+ lines)** — extracted `StepIndicator` (step progress dots), `Field` (reusable label+error wrapper), `Step0Personal`, `Step1Clinical` (with `StatusPill` sub-component), `Step2Vitals`. Added `getInputCls(field, errors)` module-level helper in `helpers.ts` and `StepProps` interface in `types.ts`. `AddPatientModal/index.tsx` is now ~130 lines (orchestration only).
- [ ] **"Forgot password?" button does nothing** — deferred per product decision.
- [x] **`AddPatientModal` and `NewAppointmentModal` form state should use React Hook Form + Zod** — both modals manage 3–5 separate `useState` calls for individual fields plus a manual validation function. React Hook Form with a Zod resolver eliminates all of that: field registration, dirty state, error messages, and submit handling in one place. Already done for auth forms; apply the same pattern here. Multi-step validation uses `trigger(STEP_FIELDS[step])` per step; `STEP_FIELDS[0]` includes email so invalid emails block step 0 advancement. `stepErrors` (filtered via `useMemo` to only current step's field keys) is passed to each step component — prevents zodResolver cross-step error bleed where vitals fields appeared red immediately on step 3 arrival.
- [x] **Deduplicate status color logic** — `patients/utils.ts` converted to `PATIENT_STATUS_COLORS` Record (`{ color, bg }` per status) with `getStatusColor`/`getStatusBg` as thin wrappers for backwards compatibility. `AddPatientModal/constants.ts` `STATUS_COLORS` now derives from `PATIENT_STATUS_COLORS.*.color` instead of duplicating the values. `PatientModal/constants.ts` `PRESCRIPTION_COLORS` unchanged (unique to prescriptions). Appointment status colors remain in `features/appointments/constants.ts` as the single source; `statusConfig.tsx` and `AppointmentsTab` both spread from it.

---

## P2 — High Quality Issues

- [x] **Replace all date formatting with `date-fns`** — all `toLocaleDateString()`, `toISOString().split("T")[0]`, and manual `.setDate()`/`.getDate()` arithmetic replaced with `date-fns` (`format`, `parseISO`, `addDays`, `startOfWeek`, `getDate`, `getYear`) across `src/utils/format.ts`, `AppointmentsPage/helpers.ts`, `AppointmentsPage/index.tsx`, `WeekStrip`, `AppointmentDetailModal`, `BillingDetailModal`, `BillingTable`, `AppointmentsTab`, `BillingTab`, `PrescriptionsTab`, `AddPatientModal/constants.ts`, `NewAppointmentModal/helpers.ts`.
- [x] **Add debouncing to all search inputs** — `use-debounce` installed; `useDebounce(value, 300)` applied to `PatientDetailsPage/FilterBar` (local state + debounced dispatch + sync-back on clearFilters), `AppointmentsPage` (local `searchInput` → debounced `searchQuery`), `BillingTable` (local `searchInput` → debounced `search`). Fixed critical input lag bug: all three `SearchInput` `value` props were bound to the debounced value instead of the local state — only the last typed character would appear. Fixed by binding `value` to the immediate local state in all three components (`FilterBar`, `BillingTable`, `AppointmentsPage/FilterBar`).
- [x] **Derived state belongs in selectors** — `src/features/billing/selectors.ts`: `selectTotalBilled`, `selectTotalInsuranceCovered`, `selectTotalPatientDue`, `selectApprovalRate`, `selectBillingByStatus`. `src/features/appointments/selectors.ts`: `selectDoctorRoster`, `selectAppointmentsByDate`, `selectAppointmentCountByStatus`, `selectActionRequired`. Wired into `BillingPage`, `AnalyticsPage/FinancialBreakdown`, and `AppointmentsPage` replacing all inline `useMemo` reductions.
- [x] **`serializableCheck: false` in store** — removed; root cause was Firebase `User` object stored directly in Redux. `ProtectedRoute` now maps it to a plain `{ uid, email, displayName, photoURL }` before dispatch. RTK's default serializable check is active.
- [x] **Add Error Boundaries** — `src/components/ErrorBoundary/index.tsx` class component with "Try again" reset button and graceful error display. Top-level `<ErrorBoundary>` in `App.tsx` as last-resort safety net (catches errors outside the router: `AuthInitializer`, Redux setup, etc.). All child routes use React Router's built-in `errorElement={<RouteError />}` — `RouteError` (`src/components/RouteError/index.tsx`) uses `useRouteError()` + `isRouteErrorResponse()` to surface the actual error message within `AppLayout` (sidebar stays visible). All 5 protected routes covered: `/dashboard`, `/analytics`, `/patients`, `/appointments`, `/billing`.
- [x] **Fix all missing accessibility attributes** — Navbar theme toggle: `aria-label="Switch to light/dark mode"` (dynamic). Navbar bell: `aria-label="Notifications, N unread"`. `PatientModal` tabs: `role="tab"`, `aria-selected`, `aria-controls`, `id` on each `TabButton`; tab container gets `role="tablist"` + `aria-label`; tab panel gets `role="tabpanel"` + `aria-labelledby`. Modal dialog: `role="dialog"`, `aria-modal="true"`, `aria-label`. Close buttons: `aria-label="Close patient profile"`.
- [x] **Deduplicate time formatting helpers** — `t2m` and `minToTime` moved to `src/utils/time.ts`; re-exported from `NewAppointmentModal/helpers.ts` for backwards compatibility; `NewAppointmentModal/index.tsx` imports directly from `@/utils/time`.

---

## P2 — Colour Token Gaps (partially addressed)

- [x] **`rgba` alpha variants are still hardcoded** — added 17 alpha tokens to `globals.css` (`--accent-blue-subtle/muted/border`, `--accent-cyan-*`, `--accent-yellow-*`, `--accent-red-*`, `--accent-green-subtle/border`, `--accent-purple-subtle/border`). Replaced all 0.1 and 0.2 occurrences via batch `sed` across 31 source files. All constants/config objects (`APPT_STATUS_COLORS`, `CLAIM_STATUS_COLORS`, `PATIENT_STATUS_COLORS`, `PRESCRIPTION_COLORS`, `Toast CONFIG`, `Button danger variant`) now reference CSS var tokens.
- [x] **Design-system gaps in chart/dept colours** — `--chart-sky: #38bdf8`, `--chart-indigo: #6366f1`, `--chart-violet: #a78bfa`, `--chart-gray: #6b7280` added to `globals.css`. All usages in `data/analytics.ts`, `features/appointments/constants.ts`, `AnalyticsPage/constants.ts`, and `LoginLayout/constants.ts` updated to `var(--chart-*)`.
- [x] **`RegisterPage` bypasses the design system entirely** — `RegisterCard.tsx` deleted; `RegisterPage` rebuilt using `LoginLayout` (same CSS variable token system as `LoginPage`). `RegisterForm` mirrors `LoginForm` structure with Zod + `useAuth`.
- [ ] **`LoginPage/LeftPanel.tsx` has residual dark-only hex values** — `#0c111d`, `#1d2839`, `#4b5563`, `#f8fafc`, `#9ca3af` are hardcoded because the panel is always rendered dark regardless of theme. Intentionally left: the panel is always-dark by design; replacing with `var(--x)` would make it theme-reactive and break the login page in light mode. Defer until a "force dark context" CSS mechanism is added.

---

## P3 — Inline Styles (Remaining)

The following inline `style` props are intentionally kept — they require dynamic values or CSS features not expressible as static Tailwind utilities:

- **Gradient backgrounds** (`background: "var(--gradient-primary)"`) in `Sidebar`, `Navbar`, `Sidebar` user avatar, `AddPatientModal` submit button, `LeftPanel` logo icon, `AuthForm` submit button — Tailwind's `bg-` prefix does not support CSS gradient variables without adding a `backgroundImage` extension to the config. Add `backgroundImage: { 'gradient-primary': 'var(--gradient-primary)', ... }` to `tailwind.config.js` to unlock `bg-gradient-primary`.
- **Dynamic color template strings** (`` `${color}18` ``, `` `3px solid ${typeColor}` ``) in `KpiCard`, `PatientModal`, `NewAppointmentModal` — value is computed at runtime from props/state.
- **`getStatusBg()` / `getStatusColor()` returns** in `PatientGrid`, `PatientListView`, `PatientModal` — function returns a string at runtime.
- **Dynamic slide color** (`color: slide.color`) in `LeftPanel/FeatureCarousel` — color is runtime state.
- **Dynamic carousel dot widths** (`width: i === active ? "20px" : "6px"`) in `LeftPanel/FeatureCarousel` — value is runtime state.
- **CSS animations** (`animation: "alert-pulse..."`, `animation: "pulse..."`, `animation: "ping-red..."`) in `CriticalBanner`, `PatientGrid` — custom keyframe names not in Tailwind's animation config.
- **Dynamic width percentages** (progress bars) in `DoctorSchedules`, `FinancialBreakdown` — `${pct}%` computed at runtime.
- **Dynamic positioning** (`left`, `top` from `hoveredBlock` state) in `NewAppointmentModal` — position is calculated from pointer events.
- **`scrollbarWidth: "none"`** — not available as a Tailwind utility.
- **Recharts / SVG attributes** (`stroke`, `fill`, `stopColor`) — SVG presentation attributes, not HTML style props.
- **Framer Motion animated properties** — values passed directly to motion's `animate`/`style` animate from/to; extracting to className would break the animation (e.g. `BillingTable` collapsible panel `maxHeight`).
- **`RegisterPage` hardcoded hex colors** — tracked separately in the colour token gap item above.
- **`LoginPage/LeftPanel` residual hex values** (`#0c111d`, `#1d2839`, `#f8fafc`, `#9ca3af`, `#4b5563`) — tracked separately in the colour token gap item above. Structural layout styles have been converted; only color values remain.
- **Dynamic claim status colors** in `BillingTable` filter buttons — `CLAIM_STATUS_COLORS[s].color` / `.bg` are runtime lookups, not static Tailwind classes.
- **Dynamic appointment type border** in `NewAppointmentModal` — `` `3px solid ${typeColor}` `` is runtime string.

---

## P3 — Import Order & Naming

- [x] **Install `eslint-plugin-simple-import-sort`** — installed; added to `eslint.config.js` with `plugins: { 'simple-import-sort' }` and rules `simple-import-sort/imports`/`exports` as `warn`. Enforced order: (1) React, (2) third-party, (3) `@/hooks` → `@/lib` → `@/components`, (4) relative, (5) `import type` last.
- [x] **`RegisterPage/components/RegisterCard.tsx` import order** — moot; `RegisterCard.tsx` was deleted entirely and replaced with `RegisterForm`.
- [x] **`AnalyticsPage/components/ChartsRow.tsx` import order** — no lucide import present in file; no action needed.

---

## P3 — Technical Debt

- [x] **`patientsSlice.isLoading` is dead state** — removed `isLoading` from `PatientsState` interface and `initialState` in `patientsSlice.ts`.
- [x] **Hardcoded demo date `"2026-05-11"`** — extracted to `src/lib/constants.ts` as `TODAY_DEMO_DATE`; `AppointmentsPage/constants.ts` and `DashboardPage/constants.ts` both import and re-export it as `TODAY_DATE`.
- [x] **`Date.now()` used for ID generation in 3 places** — replaced with `crypto.randomUUID()` in `uiSlice.ts` (`addToast`, `addNotification`) and `NewAppointmentModal/helpers.ts` (`buildAppointment`).
- [x] **Magic number timeouts with no named constants** — `TOAST_DISMISS_MS = 3500` added to `ToastContainer/constants.ts`; `CAROUSEL_INTERVAL_MS = 3000` added to `LoginLayout/constants.ts`; `DAILY_SUMMARY_DELAY_MS = 5000` added to `DashboardPage/constants.ts`. All usages updated.
- [x] **`new Date()` called in `uiSlice` initialState** — replaced all `new Date()` / `new Date(Date.now() - offset)` calls in initial notifications with fixed ISO strings anchored to the demo date (`"2026-05-11T09:00:00.000Z"` etc.). `addNotification` reducer still uses `new Date().toISOString()` correctly at dispatch time.
- [x] **Fragile ID generation in `AddPatientModal`** — `getNextId` in `helpers.ts` now filters out `NaN`/non-finite values and defaults `maxId` to `0` on empty array. `AddPatientModal/index.tsx` uses `getNextId(patients)` directly instead of duplicating the logic inline. `buildPatient` accepts a pre-computed `nextId: string`.
- [x] **Module-scope calculations in `DashboardPage`** — replaced the empty-dep `useMemo` that imported `mockBillingData` directly with `useAppSelector(selectTotalBilled)`, `useAppSelector(selectApprovalRate)`, and `useAppSelector(selectBillingByStatus)`. `mockBillingData` import removed.
- [x] **`inputCls` helper defined inside component body** — `getFieldCls(field, errors)` extracted to module-level in `NewAppointmentModal/helpers.ts`; all `fieldCls(x)` calls in `index.tsx` replaced with `getFieldCls(x, errors)`. `AddPatientModal` was already fixed in a prior pass.
- [x] **Unused Firebase Analytics import** — removed `getAnalytics` import and `analytics` export from `src/lib/firebase/index.ts`; also removed unused `measurementId` from firebaseConfig.
- [x] **`helper.tsx` vs `helpers.ts` inconsistency** — `AnalyticsPage/helper.tsx` renamed to `helpers.tsx`; import in `ChartsRow.tsx` updated to `../helpers`.
- [x] **Single-letter variable names** — `k` (KPI), `t` (tab), `f` (form state), `n` (notification), `r` (record), `s` (status/step), `p` (patient), `d` (doctor/duration) renamed throughout all pages and components.

---

## Completed

- [x] **`auth.isLoading` permanently `true` after submit** — removed `dispatch(setLoading)` from forms; loading is now local state only in `useFirebaseAuth`.
- [x] **`RegisterPage` / `RegisterCard` dead code** — deleted both files; `/register` now renders a real `RegisterPage` with `RegisterForm`.
- [x] **Split `AuthForm`** — Firebase logic extracted to `useAuth.ts` (full implementation, not a re-export; `useFirebaseAuth.ts` deleted); `LoginForm` and `RegisterForm` are fully presentational.
- [x] **`isRegister` derived from `useLocation()`** — split into two independent components (`LoginForm`, `RegisterForm`); no router reads inside forms.
- [x] **Labels not linked to inputs** — `AuthInput` component uses proper `htmlFor`/`id` pairing on every field.
- [x] **Deduplicate error message maps** — single `src/lib/errorMessages.ts` with `getFirebaseErrorMessage()`.
- [x] **Deduplicate validation logic** — `src/lib/validators.ts` with Zod schemas (`loginSchema`, `registerSchema`); hand-rolled regex deleted.
- [x] **Unsafe Firebase error casting** — `useFirebaseAuth` uses `instanceof FirebaseError` throughout.
- [x] **`onFocus`/`onBlur` DOM mutations in `RegisterCard`** — `RegisterCard` deleted.
- [x] **`useCallback` noise on validate/handleSubmit** — new forms use plain `async` functions with no unnecessary `useCallback`.
- [x] **`setTimeout` without cleanup in `RegisterCard`** — `RegisterCard` deleted.
- [x] **Input className duplicated 3×** — `AuthInput` component created; all auth inputs use it.
- [x] **Password toggle missing `aria-label`** — `AuthInput` `rightElement` buttons include `aria-label` on show/hide toggle.
- [x] **`RegisterPage` bypasses design system** — deleted; replaced with `LoginLayout` (same token system as `LoginPage`).
- [x] **Redundant `ThemeInitializer` component** — deleted from `routes/index.tsx`; `uiSlice.ts` already sets `data-theme` at module load.
- [x] **Email validation with weak regex** — replaced with `z.string().email()` via Zod across both auth forms.
- [x] **`LoginLayout` as shared auth shell** — `LeftPanel`, `constants.ts`, `types.ts` moved to `src/components/layout/LoginLayout/`; both `LoginPage` and `RegisterPage` compose it.
- [x] **Provider-agnostic auth hook** — `useAuth.ts` is the full implementation with `UseAuthReturn` interface; `useFirebaseAuth.ts` deleted. Swapping providers means rewriting `useAuth.ts` only.
- [x] **Orphaned CSS files deleted** — `src/index.css` and `src/App.css` were stub comment files with no consumers; removed.
- [x] **Explicit TypeScript types codebase-wide** — added `: React.ReactElement` on all components, `(s: RootState) =>` on all selectors, `: Promise<void>` on async functions, typed map/filter/reduce callbacks, `UseAuthReturn` interface on `useAuth`, `inputCls` return type `string`, field handler return types. Skipped `useState` for unambiguously-inferred primitives (`boolean`, `number`, `string`).
- [x] **Page transition lag from lazy loading** — root cause: outer `Suspense fallback={null}` was unmounting Sidebar/Navbar on every navigation. Fix: nested `Suspense` with `<PageLoader />` inside `AppLayout` wrapping only `<Outlet />`; Sidebar/Navbar stay mounted throughout.
- [x] **PageLoader component** — `src/components/ui/PageLoader/` — gradient arc ring spinner via `conic-gradient` + `radial-gradient` CSS mask. No SVG, no extra dependencies.
- [x] **Mobile responsive layout** — `sm:` (640px) breakpoints added throughout: Sidebar slide-in drawer, Navbar hamburger button, modal sheet pattern (`items-end sm:items-center`, `rounded-t-[24px] sm:rounded-[24px]`), KPI/chart grids (`grid-cols-1 sm:grid-cols-N`), AppLayout margin (`ml-0 sm:ml-[264px]`). Final mobile polish deferred.
- [x] **`React.memo` / `useCallback` / sub-component extraction pass — all pages and `src/components/`** — every exported component wrapped with `memo`; every handler defined inside a component body wrapped with `useCallback` (correct deps); `.map()` items that own dispatch calls extracted to dedicated `memo`-wrapped sub-components so `useCallback` is valid inside them (`NotificationItem`, `FilterTab`, `DotButton` in Navbar/LeftPanel; `TabButton` in `PatientModal`; `StatusPill` in `AddPatientModal`; `DurationButton`, `SlotButton` in `NewAppointmentModal`; `RecentPatientRow`, `AppointmentRow` in `TrendsRow`/`AppointmentsTable`; `CriticalPatientCard` in `CriticalBanner`; `AppointmentCard`, `ActionItem` in `AppointmentList`/`ActionRequired`; `PatientCard`, `PatientListRow` in `PatientGrid`/`PatientListView`); `type="button"` added to every non-submit button; all single-letter iterators renamed to descriptive names; `onPatientClick: (patient: Patient) => void` prop pattern established for card components so stable parent callbacks thread down without creating new closures; `NewAppointmentModal` gains `useMemo` for `docBusy`, `patBusy`, `doctors`, `selConflict`, `slotConflicts`; `KpiCard` `cursor` converted from inline style to Tailwind conditional; submit button gradient converted from `style` to `[background:var(--gradient-primary)]` Tailwind arbitrary value; `Button` and `Input` use `memo(forwardRef(...))` pattern; `forwardRef` components have `.displayName` set on the `memo` wrapper.
