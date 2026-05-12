import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3X3,
  List,
  Filter,
  X,
  ChevronDown,
  Activity,
  Heart,
  UserPlus,
} from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { AddPatientModal } from "@/components/AddPatientModal";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  setViewMode,
  setSearchQuery,
  setFilterStatus,
  setFilterDepartment,
  clearFilters,
  setSelectedPatient,
} from "@/features/patients/patientsSlice";
import { showPatientAlertNotification } from "@/lib/notifications";
import type { Patient } from "@/types";
import { getStatusBg, getStatusColor, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const DEPARTMENTS = [
  "All",
  "Cardiology",
  "Neurology",
  "Pulmonology",
  "Endocrinology",
  "Orthopedics",
  "Surgery",
  "Nephrology",
  "Internal Medicine",
  "Gastroenterology",
  "Rheumatology",
];
const STATUSES = ["All", "Active", "Critical", "Recovering", "Discharged"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function PatientCard({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  const isCritical = patient.status === "Critical";
  return (
    <motion.div
      variants={item}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        "glass-card rounded-20 p-5 cursor-pointer relative overflow-hidden",
        isCritical && "border-[rgba(239,68,68,0.4)]",
      )}
    >
      {isCritical && (
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-red"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.15, background: "var(--gradient-card)" }}
      />
      <div className="relative">
        <div className="flex items-start gap-3 mb-[14px]">
          <Avatar initials={patient.avatar} size={44} radius="14px" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                {patient.name}
              </h3>
              <span
                className="text-[11px] font-medium py-[2px] px-2 rounded-[8px] shrink-0"
                style={{
                  background: getStatusBg(patient.status),
                  color: getStatusColor(patient.status),
                }}
              >
                {patient.status}
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary mt-[2px]">
              {patient.id} · {patient.age}y · {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[6px] mb-[14px]">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Activity size={12} className="text-accent-blue shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {patient.diagnosis}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Heart size={12} className="text-accent-cyan shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {patient.department}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border-primary">
          <span className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap flex-1">
            {patient.doctor}
          </span>
          <span className="text-[11px] text-text-tertiary shrink-0 ml-2">
            {formatDate(patient.lastVisit)}
          </span>
        </div>
        {patient.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-[10px]">
            {patient.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] py-[2px] px-2 rounded-full bg-bg-tertiary text-text-tertiary"
              >
                {tag}
              </span>
            ))}
            {patient.tags.length > 2 && (
              <span className="text-[10px] py-[2px] px-2 rounded-full bg-bg-tertiary text-text-tertiary">
                +{patient.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PatientListRow({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  return (
    <motion.tr
      variants={item}
      onClick={onClick}
      className="cursor-pointer border-b border-border-primary transition-colors duration-200 hover:bg-bg-tertiary"
    >
      <td className="py-[14px] px-4">
        <div className="flex items-center gap-[10px]">
          <Avatar initials={patient.avatar} size={36} radius="10px" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              {patient.name}
            </p>
            <p className="text-[11px] text-text-tertiary">{patient.id}</p>
          </div>
        </div>
      </td>
      <td className="py-[14px] px-4 text-[13px] text-text-secondary">
        {patient.age}y · {patient.gender}
      </td>
      <td className="py-[14px] px-4 text-[13px] text-text-secondary">
        {patient.diagnosis}
      </td>
      <td className="py-[14px] px-4 text-[13px] text-text-secondary">
        {patient.department}
      </td>
      <td className="py-[14px] px-4 text-[13px] text-text-secondary">
        {patient.doctor}
      </td>
      <td className="py-[14px] px-4">
        <span
          className="text-xs font-medium py-1 px-[10px] rounded-[8px]"
          style={{
            background: getStatusBg(patient.status),
            color: getStatusColor(patient.status),
          }}
        >
          {patient.status}
        </span>
      </td>
      <td className="py-[14px] px-4 text-[13px] text-text-secondary">
        {formatDate(patient.lastVisit)}
      </td>
    </motion.tr>
  );
}

export default function PatientDetailsPage() {
  const dispatch = useAppDispatch();
  const {
    patients,
    filteredPatients,
    viewMode,
    searchQuery,
    filterStatus,
    filterDepartment,
  } = useAppSelector((s) => s.patients);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const hasActiveFilters = filterStatus !== "All" || filterDepartment !== "All";

  const handlePatientClick = async (patient: Patient) => {
    dispatch(setSelectedPatient(patient));
    if (patient.status === "Critical")
      await showPatientAlertNotification(patient.name, patient.diagnosis);
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">
              Patients
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-[7px] py-[9px] px-[18px] rounded-[12px] text-[13px] font-semibold border-0 cursor-pointer font-sans bg-accent-blue text-white shadow-[0_4px_14px_rgba(60,131,246,0.3)]"
            >
              <UserPlus size={15} /> Add Patient
            </button>
            <div className="flex items-center gap-1 p-1 rounded-[12px] bg-bg-secondary border border-border-primary">
              {[
                {
                  mode: "grid" as const,
                  icon: <Grid3X3 size={15} />,
                  label: "Grid",
                },
                {
                  mode: "list" as const,
                  icon: <List size={15} />,
                  label: "List",
                },
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <SearchInput
          value={searchQuery}
          onChange={(v) => dispatch(setSearchQuery(v))}
          placeholder="Search by name, diagnosis, doctor..."
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 py-[10px] px-4 rounded-[12px] text-[13px] font-medium border cursor-pointer font-sans transition-all duration-200",
            hasActiveFilters
              ? "border-[rgba(60,131,246,0.4)] bg-[rgba(60,131,246,0.1)] text-accent-blue"
              : "border-border-primary bg-bg-secondary text-text-secondary",
          )}
        >
          <Filter size={15} /> Filters{" "}
          {hasActiveFilters && <Badge variant="info">Active</Badge>}
          <ChevronDown
            size={14}
            style={{
              transition: "transform 200ms",
              transform: showFilters ? "rotate(180deg)" : "none",
            }}
          />
        </button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-[6px]"
          >
            <X size={14} /> Clear
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            animate={{ opacity: 1, maxHeight: 240, marginBottom: 24 }}
            exit={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card rounded-[16px] p-5 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: "Status",
                  items: STATUSES,
                  current: filterStatus,
                  action: setFilterStatus,
                },
                {
                  label: "Department",
                  items: DEPARTMENTS,
                  current: filterDepartment,
                  action: setFilterDepartment,
                },
              ].map(({ label, items, current, action }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-3">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <button
                        key={s}
                        onClick={() => dispatch(action(s))}
                        className={cn(
                          "py-[6px] px-3 rounded-[10px] text-xs font-medium border-0 cursor-pointer font-sans transition-all duration-200",
                          current === s
                            ? "bg-accent-blue text-white"
                            : "bg-bg-tertiary text-text-secondary",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredPatients.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onClick={() => handlePatientClick(p)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-20 overflow-hidden"
          >
            <table className="w-full border-collapse">
              <thead className="bg-bg-tertiary border-b border-border-primary">
                <tr>
                  {[
                    "Patient",
                    "Age / Gender",
                    "Diagnosis",
                    "Department",
                    "Doctor",
                    "Status",
                    "Last Visit",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredPatients.map((p) => (
                  <PatientListRow
                    key={p.id}
                    patient={p}
                    onClick={() => handlePatientClick(p)}
                  />
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-[40px] mb-4">🔍</p>
          <p className="text-[18px] font-semibold text-text-primary">
            No patients found
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() => dispatch(clearFilters())}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
      `}</style>

      <AnimatePresence>
        {showAddModal && (
          <AddPatientModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
