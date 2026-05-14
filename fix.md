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
- [ ] **"Forgot password?" button does nothing** — `LoginForm` renders the button with no `onClick` handler. Dead UI ships to production. Wire up `sendPasswordResetEmail` from Firebase or remove the button.
- [ ] **`AddPatientModal` and `NewAppointmentModal` form state should use React Hook Form + Zod** — both modals manage 3–5 separate `useState` calls for individual fields plus a manual validation function. React Hook Form with a Zod resolver eliminates all of that: field registration, dirty state, error messages, and submit handling in one place. Already done for auth forms; apply the same pattern here.
- [ ] **Deduplicate status color logic** — defined in `lib/constants.ts`, `lib/utils.ts`, `PatientModal/constants.ts`, and `AppointmentsPage/statusConfig.tsx`. One source of truth only.

---

## P2 — High Quality Issues

- [ ] **Replace all date formatting with `date-fns`** — `toLocaleDateString()` is called in 7+ places (`PatientModal`, `lib/utils.ts`, `AppointmentsPage`, `BillingPage`, `WeekStrip`); `toISOString().split("T")[0]` appears in `AddPatientModal/constants.ts` and `AppointmentsPage/helpers.ts`; manual `.setDate()`/`.getDate()` arithmetic in `AppointmentsPage/helpers.ts`. Replace all with `date-fns` — `format()`, `addDays()`, `startOfWeek()`, `parseISO()`. Consistent locale, timezone-safe, tree-shakeable.
- [ ] **Add debouncing to all search inputs** — `AppointmentsPage` search, `PatientDetailsPage/FilterBar` dispatch, and `BillingTable` search all update state on every keystroke with no delay. Install `use-debounce` and wrap each with `useDebounce(value, 300)` to reduce unnecessary renders and Redux dispatches.
- [ ] **Derived state belongs in selectors** — `totalBilled`, `approvalRate`, filtered appointment lists, doctor rosters are computed in component bodies with `useMemo`. Move to `createSelector` (RTK) so every consumer gets the memoized result without duplicating dependency arrays.
- [x] **`serializableCheck: false` in store** — removed; root cause was Firebase `User` object stored directly in Redux. `ProtectedRoute` now maps it to a plain `{ uid, email, displayName, photoURL }` before dispatch. RTK's default serializable check is active.
- [ ] **Add Error Boundaries** — no `ErrorBoundary` exists anywhere. One bad render (malformed chart data, bad mock entry) crashes the entire app to a white screen. Add at app root and around modal/chart-heavy pages.
- [ ] **Fix all missing accessibility attributes** — Navbar bell + theme toggle have no `aria-label`. PatientModal tabs need `aria-selected` + `aria-controls`. Modals need focus trap and focus restoration on close.
- [ ] **Deduplicate time formatting helpers** — `AppointmentsPage/helpers.ts` and `NewAppointmentModal/helpers.ts` both implement time formatting. Consolidate into `src/lib/utils.ts`.

---

## P2 — Colour Token Gaps (partially addressed)

- [ ] **`rgba` alpha variants are still hardcoded** — `rgba(60,131,246,0.1)`, `rgba(14,165,233,0.12)`, `rgba(239,68,68,0.35)`, etc. appear throughout components and constants. The design system has no alpha-channel tokens. Add `--accent-blue-subtle`, `--accent-cyan-subtle`, `--accent-red-subtle`, `--accent-yellow-subtle`, `--accent-purple-subtle` CSS variables (at 10–12% opacity) and replace all inline `rgba(...)` background/border values.
- [ ] **Design-system gaps in chart/dept colours** — `#38bdf8` (Orthopedics), `#6366f1` (Surgery/PROC_COLORS), `#a78bfa` (Nephrology), `#6b7280` (Others) are used in `departmentStats.ts`, `mockData.ts`, and `AnalyticsPage/constants.ts` with no corresponding CSS variable. Add them to the design system or replace with existing tokens.
- [x] **`RegisterPage` bypasses the design system entirely** — `RegisterCard.tsx` deleted; `RegisterPage` rebuilt using `LoginLayout` (same CSS variable token system as `LoginPage`). `RegisterForm` mirrors `LoginForm` structure with Zod + `useAuth`.
- [ ] **`LoginPage/LeftPanel.tsx` has residual dark-only hex values** — `#0c111d`, `#1d2839`, `#4b5563`, `#f8fafc`, `#9ca3af` are hardcoded because the panel is always rendered dark regardless of theme. These should map to the dark-mode CSS var values (`--bg-secondary`, `--border-primary`, etc.) and be expressed as `var(--x)` so a future theme change doesn't require revisiting.

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

- [ ] **Install `eslint-plugin-simple-import-sort`** — automates import ordering so violations are caught at lint time. Add to `eslint.config.js` with rules `simple-import-sort/imports` and `simple-import-sort/exports`, then run `eslint --fix` once to sort all files. Enforced order: (1) React, (2) third-party, (3) `@/hooks` → `@/lib` → `@/components`, (4) relative, (5) `import type` last.
- [ ] **`RegisterPage/components/RegisterCard.tsx` import order** — Firebase auth imports, local `@/lib/firebase`, hooks, and features are interleaved rather than grouped. Defer until `simple-import-sort` is installed so the fix is automated.
- [ ] **`AnalyticsPage/components/ChartsRow.tsx` import order** — lucide-react appears after a block of recharts imports; should be grouped with all third-party libraries first.

---

## P3 — Technical Debt

- [ ] **`patientsSlice.isLoading` is dead state** — the `isLoading` field exists in `PatientsState` but is never set by any reducer action and never read by any consumer. Either wire it up to actual async data fetching or remove it entirely.
- [ ] **Hardcoded demo date `"2026-05-11"`** — appears in `AppointmentsPage/index.tsx` (×2), `DashboardPage/index.tsx`, and `AppointmentsTable.tsx`. Extract to a shared constant (`src/lib/constants.ts`) as `TODAY_DEMO_DATE` so all filter comparisons reference one place.
- [ ] **`Date.now()` used for ID generation in 3 places** — `uiSlice.ts` uses `` `T${Date.now()}` `` (addToast) and `` `N${Date.now()}` `` (addNotification); `NewAppointmentModal/helpers.ts` uses `` `A${Date.now()}` ``. `Date.now()` is not collision-safe under rapid dispatch. Replace all with `crypto.randomUUID()`. Already noted for `AddPatientModal` — apply consistently.
- [ ] **Magic number timeouts with no named constants** — `3500` (ToastContainer auto-dismiss), `3000` (LeftPanel carousel interval), `5000` (DashboardPage daily summary delay). Extract each to a named constant (`TOAST_DISMISS_MS`, `CAROUSEL_INTERVAL_MS`, `DAILY_SUMMARY_DELAY_MS`) so the intent is readable and changes are made in one place.
- [ ] **`new Date()` called in `uiSlice` initialState** — notification timestamps (`new Date().toISOString()`) are computed once at module load time, not when the notification was actually created. The timestamp is frozen at app boot. Timestamps should be assigned when the action is dispatched, not in the initial static data.
- [ ] **Fragile ID generation in `AddPatientModal`** — `Math.max(...patients.map(p => parseInt(p.id.slice(1))))` silently returns `NaN` on format mismatch, `-Infinity` on empty array, and stack overflows at scale. Replace with `crypto.randomUUID()`.
- [ ] **Module-scope calculations in `DashboardPage`** — some derived values execute at import time by reading `mockBillingData` directly at the top level. Move inside the component or into selectors.
- [ ] **`inputCls` helper defined inside component body** — in `AddPatientModal`, re-defined on every render. Move outside the component.
- [ ] **Unused Firebase Analytics import** — `getAnalytics` imported in `firebase.ts` but never used.
- [ ] **`helper.tsx` vs `helpers.ts` inconsistency** — `AnalyticsPage` uses `.tsx` extension for a file with no JSX. Standardise to `.ts`.
- [ ] **Single-letter variable names** — `k` (KPI), `t` (tab), `f` (form state) used across pages. Spell them out.

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
