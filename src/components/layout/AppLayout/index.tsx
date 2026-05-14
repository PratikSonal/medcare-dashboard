import { AnimatePresence } from "framer-motion";
import { memo, Suspense, useCallback } from "react";
import { Outlet } from "react-router-dom";

import { PatientModal } from "@/components/modal/PatientModal";
import { ToastContainer } from "@/components/ToastContainer";
import { PageLoader } from "@/components/ui/PageLoader";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useThemeSync } from "@/hooks/useThemeSync";
import type { RootState } from "@/store";

import { Navbar } from "../Navbar";
import { Sidebar } from "../Sidebar";

export const AppLayout = memo((): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector((s: RootState) => s.patients.selectedPatient);
  useThemeSync();

  const handleCloseModal = useCallback(() => dispatch(setSelectedPatient(null)), [dispatch]);

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
        {selectedPatient && <PatientModal patient={selectedPatient} onClose={handleCloseModal} />}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
});
