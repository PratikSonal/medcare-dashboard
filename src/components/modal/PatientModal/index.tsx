import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield, Pill, Calendar, AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { getStatusBg, getStatusColor } from "@/features/patients/utils";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { OverviewTab } from "./tabs/OverviewTab";
import { AppointmentsTab } from "./tabs/AppointmentsTab";
import { BillingTab } from "./tabs/BillingTab";
import { PrescriptionsTab } from "./tabs/PrescriptionsTab";
import type { Props, TabId } from "./types";
import type { RootState } from "@/store";
import type { Appointment } from "@/features/appointments/types";

interface TabButtonProps {
  tabId: TabId;
  label: string;
  icon: React.ReactNode;
  count?: number;
  isActive: boolean;
  onTabSelect: (id: TabId) => void;
}

const TabButton = memo(({ tabId, label, icon, count, isActive, onTabSelect }: TabButtonProps): React.ReactElement => {
  const handleClick = useCallback(() => onTabSelect(tabId), [tabId, onTabSelect]);
  return (
    <button
      type="button"
      role="tab"
      onClick={handleClick}
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabId}`}
      id={`tab-${tabId}`}
      className={cn(
        "flex items-center gap-[6px] py-[7px] px-[14px] rounded-[10px] text-[13px] font-medium border-0 cursor-pointer font-sans transition-all duration-200 whitespace-nowrap shrink-0",
        isActive ? "bg-accent-blue text-white" : "bg-transparent text-text-secondary",
      )}
    >
      {icon} {label}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-[10px] py-[1px] px-[6px] rounded-full font-semibold",
            isActive ? "bg-[rgba(255,255,255,0.25)] text-white" : "bg-bg-tertiary text-text-tertiary",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
});

export const PatientModal = memo(({ patient, onClose }: Props): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const allAppointments = useAppSelector((s: RootState) => s.appointments.appointments);
  const allBillingRecords = useAppSelector((s: RootState) => s.billing.records);
  const allPrescriptions = useAppSelector((s: RootState) => s.patients.prescriptions);

  const appointments = allAppointments.filter((a: Appointment) => a.patientId === patient.id);
  const billingRecords = allBillingRecords.filter(r => r.patientId === patient.id);
  const prescriptions = allPrescriptions.filter(r => r.patientId === patient.id);

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: <FileText size={13} /> },
    { id: "appointments" as const, label: "Appointments", icon: <Calendar size={13} />, count: appointments.length },
    { id: "billing" as const, label: "Insurance & Billing", icon: <Shield size={13} /> },
    { id: "prescriptions" as const, label: "Prescriptions", icon: <Pill size={13} />, count: prescriptions.filter(r => r.status === "Active").length },
  ];

  const handleTabSelect = useCallback((id: TabId) => setActiveTab(id), []);
  const handleStopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px]"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Patient profile: ${patient.name}`}
        className="w-full sm:max-w-[660px] max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-[24px] sm:rounded-[24px] bg-bg-secondary border border-border-primary"
        onClick={handleStopPropagation}
      >
        {/* Header */}
        <div className="p-6 border-b border-border-primary shrink-0 relative">
          {patient.status === "Critical" ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 py-[10px] px-[14px] rounded-[12px] text-[13px] bg-[var(--accent-red-subtle)] border border-[rgba(239,68,68,0.3)] text-accent-red">
                <AlertTriangle size={14} /> Critical patient — immediate attention required
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close patient profile"
                className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center bg-bg-tertiary border-0 cursor-pointer text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close patient profile"
              className="absolute top-6 right-6 w-8 h-8 rounded-[10px] flex items-center justify-center bg-bg-tertiary border-0 cursor-pointer text-text-secondary"
            >
              <X size={16} />
            </button>
          )}
          <div className="flex items-start gap-4">
            <Avatar initials={patient.avatar} size={60} radius="18px" />
            <div>
              <h2 className="text-[22px] font-bold text-text-primary">{patient.name}</h2>
              <p className="text-[13px] text-text-secondary mt-1">
                {patient.id} · {patient.age}y · {patient.gender} · {patient.bloodGroup}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-[10px]">
                <span
                  className="text-[13px] font-medium py-1 px-3 rounded-[10px]"
                  style={{
                    background: getStatusBg(patient.status),
                    color: getStatusColor(patient.status),
                  }}
                >
                  {patient.status}
                </span>
                {patient.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Patient information tabs" className="flex gap-1 py-3 px-6 border-b border-border-primary shrink-0 overflow-x-auto">
          {tabs.map(tabDef => (
            <TabButton
              key={tabDef.id}
              tabId={tabDef.id}
              label={tabDef.label}
              icon={tabDef.icon}
              count={"count" in tabDef ? tabDef.count : undefined}
              isActive={activeTab === tabDef.id}
              onTabSelect={handleTabSelect}
            />
          ))}
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="overflow-y-auto p-6 flex-1"
        >
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab key="overview" patient={patient} />}
            {activeTab === "appointments" && <AppointmentsTab key="appointments" appointments={appointments} />}
            {activeTab === "billing" && <BillingTab key="billing" billingRecords={billingRecords} />}
            {activeTab === "prescriptions" && <PrescriptionsTab key="prescriptions" prescriptions={prescriptions} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
});
