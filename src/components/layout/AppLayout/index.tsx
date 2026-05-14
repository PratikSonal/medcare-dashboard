import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "../Sidebar";
import { Navbar } from "../Navbar";
import { PatientModal } from "@/components/PatientModal";
import { ToastContainer } from "@/components/ToastContainer";
import { PageLoader } from "@/components/ui/PageLoader";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import type { RootState } from "@/store";

export const AppLayout = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector((s: RootState) => s.patients.selectedPatient);

  return (
    <div className="dot-grid min-h-screen bg-bg-primary">
      <Sidebar />
      <Navbar />
      <main className="min-h-screen ml-0 sm:ml-[264px] pt-[76px]">
        <div className="p-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
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
