import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/pages/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import PatientDetailsPage from '@/pages/PatientDetailsPage';
import AppointmentsPage from '@/pages/AppointmentsPage';

function ThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem('medcare-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);
  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="patients" element={<PatientDetailsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
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
