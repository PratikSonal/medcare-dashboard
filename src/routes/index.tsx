import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setUser } from "@/features/auth/authSlice";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage/index.tsx"));
const PatientDetailsPage = lazy(() => import("@/pages/PatientDetailsPage"));
const AppointmentsPage = lazy(() => import("@/pages/AppointmentsPage"));
const BillingPage = lazy(() => import("@/pages/BillingPage"));

const AuthInitializer = (): null => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      dispatch(
        setUser(
          user
            ? { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
            : null,
        ),
      );
    });
    return () => unsub();
  }, [dispatch]);

  return null;
};

export const AppRouter = () => (
  <BrowserRouter>
    <AuthInitializer />
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
          <Route path="analytics" element={<ErrorBoundary><AnalyticsPage /></ErrorBoundary>} />
          <Route path="patients" element={<PatientDetailsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
