import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { PatientModal } from '@/components/PatientModal';
import { ToastContainer } from '@/components/ToastContainer';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';

export const AppLayout = () => {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector(s => s.patients.selectedPatient);

  return (
    <div className="dot-grid min-h-screen bg-bg-primary">
      <Sidebar />
      <Navbar />
      <main
        className="min-h-screen"
        style={{ marginLeft: '264px', paddingTop: '76px' }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <AnimatePresence>
        {selectedPatient && (
          <PatientModal
            patient={selectedPatient}
            onClose={() => dispatch(setSelectedPatient(null))}
          />
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};
