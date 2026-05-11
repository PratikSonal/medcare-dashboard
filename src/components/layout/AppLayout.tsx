import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PatientModal } from '@/components/PatientModal';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector(s => s.patients.selectedPatient);

  return (
    <div className="dot-grid" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <Navbar />
      <main style={{ marginLeft: '264px', paddingTop: '76px', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </main>
      <AnimatePresence>
        {selectedPatient && (
          <PatientModal patient={selectedPatient} onClose={() => dispatch(setSelectedPatient(null))} />
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
}
