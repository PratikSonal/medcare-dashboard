import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, UserPlus } from "lucide-react";
import { AddPatientModal } from "@/components/AddPatientModal";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { setViewMode, setSelectedPatient, clearFilters } from "@/features/patients/patientsSlice";
import { showPatientAlertNotification } from "@/lib/notifications";
import type { Patient } from "@/features/patients/types";
import { cn } from "@/lib/utils";
import { FilterBar } from "./components/FilterBar";
import { PatientGrid } from "./components/PatientGrid";
import { PatientListView } from "./components/PatientListView";

const PatientDetailsPage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { patients, filteredPatients, viewMode } = useAppSelector((s: RootState) => s.patients);
  const [showAddModal, setShowAddModal] = useState(false);

  const handlePatientClick = async (patient: Patient): Promise<void> => {
    dispatch(setSelectedPatient(patient));
    if (patient.status === "Critical")
      await showPatientAlertNotification(patient.name, patient.diagnosis);
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">Patients</h1>
            <p className="text-sm text-text-secondary mt-1">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowAddModal(true)}
              whileHover="hover"
              initial="rest"
              className="flex items-center gap-[7px] py-[9px] px-[18px] rounded-[12px] text-[13px] font-semibold border-0 cursor-pointer font-sans text-white shadow-[0_4px_14px_rgba(60,131,246,0.3)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <motion.span
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.2, transition: { duration: 0.2, ease: "easeOut" } },
                }}
                className="inline-flex"
              >
                <UserPlus size={15} />
              </motion.span>
              Add Patient
            </motion.button>
            <div className="flex items-center gap-1 p-1 rounded-[12px] bg-bg-secondary border border-border-primary">
              {[
                { mode: "grid" as const, icon: <Grid3X3 size={15} />, label: "Grid" },
                { mode: "list" as const, icon: <List size={15} />, label: "List" },
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => dispatch(setViewMode(mode))}
                  className={cn(
                    "flex items-center gap-[6px] py-[7px] px-[14px] rounded-[8px] text-[13px] font-medium border-0 cursor-pointer font-sans transition-all duration-200",
                    viewMode === mode
                      ? "bg-accent-blue text-white"
                      : "bg-transparent text-text-secondary",
                  )}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="glow-line mt-4" />
      </motion.div>

      <FilterBar />

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <PatientGrid
            key="grid"
            filteredPatients={filteredPatients}
            onPatientClick={handlePatientClick}
          />
        ) : (
          <PatientListView
            key="list"
            filteredPatients={filteredPatients}
            onPatientClick={handlePatientClick}
          />
        )}
      </AnimatePresence>

      {filteredPatients.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-[40px] mb-4">🔍</p>
          <p className="text-[18px] font-semibold text-text-primary">No patients found</p>
          <p className="text-sm text-text-secondary mt-2">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => dispatch(clearFilters())} className="mt-4">
            Clear Filters
          </Button>
        </motion.div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
      `}</style>

      <AnimatePresence>
        {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default PatientDetailsPage;
