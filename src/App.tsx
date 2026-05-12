import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/pages/ProtectedRoute";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage/index.tsx"));
const PatientDetailsPage = lazy(() => import("@/pages/PatientDetailsPage"));
const AppointmentsPage = lazy(() => import("@/pages/AppointmentsPage"));
const BillingPage = lazy(() => import("@/pages/BillingPage"));

function ThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem("medcare-theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="patients" element={<PatientDetailsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
