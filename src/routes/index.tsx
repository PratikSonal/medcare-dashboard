import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate,Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { RouteError } from "@/components/RouteError";
import { setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { auth } from "@/lib/firebase";
import { ProtectedRoute } from "@/pages/ProtectedRoute";

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
          <Route path="dashboard" element={<DashboardPage />} errorElement={<RouteError />} />
          <Route path="analytics" element={<AnalyticsPage />} errorElement={<RouteError />} />
          <Route path="patients" element={<PatientDetailsPage />} errorElement={<RouteError />} />
          <Route path="appointments" element={<AppointmentsPage />} errorElement={<RouteError />} />
          <Route path="billing" element={<BillingPage />} errorElement={<RouteError />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
