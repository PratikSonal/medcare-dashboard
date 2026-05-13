import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Shield,
  Pill,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Thermometer,
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { getStatusBg, getStatusColor, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS, CLAIM_STATUS_COLORS } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { mockBillingData, mockPrescriptions } from "@/lib/mockData";
import type { Props, TabId, VitalBadgeProps } from "./types";
import { PRESCRIPTION_COLORS } from "./constants";

const APP_STATUS: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Confirmed: { ...APPT_STATUS_COLORS.Confirmed, icon: <CheckCircle size={11} /> },
  Pending: { ...APPT_STATUS_COLORS.Pending, icon: <AlertCircle size={11} /> },
  Completed: { ...APPT_STATUS_COLORS.Completed, icon: <CheckCircle size={11} /> },
  Cancelled: { ...APPT_STATUS_COLORS.Cancelled, icon: <XCircle size={11} /> },
  "No-Show": { ...APPT_STATUS_COLORS["No-Show"], icon: <XCircle size={11} /> },
};

const VitalBadge = ({ icon, label, value, alert = false }: VitalBadgeProps) => (
  <motion.div
    whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } }}
    className={cn(
      "flex flex-col items-center p-3 rounded-[12px] cursor-default",
      alert
        ? "bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]"
        : "bg-bg-tertiary border border-border-primary",
    )}
  >
    <div className={cn(alert ? "text-accent-red" : "text-accent-blue")}>{icon}</div>
    <p className="text-[10px] text-text-tertiary mt-1 text-center">{label}</p>
    <p className="text-xs font-bold text-text-primary mt-[2px] text-center">{value}</p>
  </motion.div>
);

export const PatientModal = ({ patient, onClose }: Props) => {
  const [tab, setTab] = useState<TabId>("overview");

  const allAppointments = useAppSelector(s => s.appointments.appointments);
  const billingRecords = mockBillingData.filter(r => r.patientId === patient.id);
  const prescriptions = mockPrescriptions.filter(r => r.patientId === patient.id);
  const appointments = allAppointments.filter(a => a.patientId === patient.id);
  const billing = billingRecords[0];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: <FileText size={13} /> },
    {
      id: "appointments" as const,
      label: "Appointments",
      icon: <Calendar size={13} />,
      count: appointments.length,
    },
    { id: "billing" as const, label: "Insurance & Billing", icon: <Shield size={13} /> },
    {
      id: "prescriptions" as const,
      label: "Prescriptions",
      icon: <Pill size={13} />,
      count: prescriptions.filter(r => r.status === "Active").length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="w-full max-w-[660px] max-h-[90vh] flex flex-col rounded-[24px] bg-bg-secondary border border-border-primary"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border-primary shrink-0 relative">
          {patient.status === "Critical" ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 py-[10px] px-[14px] rounded-[12px] text-[13px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-accent-red">
                <AlertTriangle size={14} /> Critical patient — immediate attention required
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center bg-bg-tertiary border-0 cursor-pointer text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
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
        <div className="flex gap-1 py-3 px-6 border-b border-border-primary shrink-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-[6px] py-[7px] px-[14px] rounded-[10px] text-[13px] font-medium border-0 cursor-pointer font-sans transition-all duration-200 whitespace-nowrap shrink-0",
                tab === t.id ? "bg-accent-blue text-white" : "bg-transparent text-text-secondary",
              )}
            >
              {t.icon} {t.label}
              {"count" in t && t.count! > 0 && (
                <span
                  className={cn(
                    "text-[10px] py-[1px] px-[6px] rounded-full font-semibold",
                    tab === t.id
                      ? "bg-[rgba(255,255,255,0.25)] text-white"
                      : "bg-bg-tertiary text-text-tertiary",
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto p-6 flex-1">
          <AnimatePresence mode="wait">
            {tab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Diagnosis", value: patient.diagnosis },
                    { label: "Department", value: patient.department },
                    { label: "Attending Doctor", value: patient.doctor },
                    { label: "Admitted On", value: formatDate(patient.admissionDate) },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-card rounded-[14px] p-[14px]">
                      <p className="text-[11px] text-text-tertiary mb-1">{label}</p>
                      <p className="text-sm font-semibold text-text-primary">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Current Vitals</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <VitalBadge
                      icon={<Heart size={16} />}
                      label="Heart Rate"
                      value={`${patient.vitals.heartRate} bpm`}
                      alert={patient.vitals.heartRate > 100}
                    />
                    <VitalBadge
                      icon={<Activity size={16} />}
                      label="BP"
                      value={patient.vitals.bloodPressure}
                      alert={parseInt(patient.vitals.bloodPressure) > 140}
                    />
                    <VitalBadge
                      icon={<Thermometer size={16} />}
                      label="Temp"
                      value={`${patient.vitals.temperature}°F`}
                      alert={patient.vitals.temperature > 100}
                    />
                    <VitalBadge
                      icon={<Wind size={16} />}
                      label="O₂ Sat"
                      value={`${patient.vitals.oxygenSat}%`}
                      alert={patient.vitals.oxygenSat < 93}
                    />
                    <VitalBadge
                      icon={<Activity size={16} />}
                      label="Weight"
                      value={`${patient.vitals.weight}kg`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    Contact Information
                  </h3>
                  <div className="flex flex-col gap-[10px]">
                    {[
                      { icon: <Phone size={14} />, text: patient.phone },
                      { icon: <Mail size={14} />, text: patient.email },
                      { icon: <MapPin size={14} />, text: patient.address },
                    ].map(({ icon, text }) => (
                      <div
                        key={text}
                        className="flex items-center gap-[10px] text-[13px] text-text-secondary"
                      >
                        <span className="text-accent-blue">{icon}</span>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {appointments.length > 0 ? (
                  <div className="flex flex-col gap-[10px]">
                    {appointments.map(app => {
                      const sc = APP_STATUS[app.status];
                      const typeColor = APPT_TYPE_COLORS[app.type] || "var(--accent-blue)";
                      return (
                        <div
                          key={app.id}
                          className="p-4 rounded-[14px] bg-bg-tertiary border border-border-primary"
                          style={{ borderLeft: `3px solid ${typeColor}` }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-[10px]">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-text-primary">
                                  {new Date(app.date).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}{" "}
                                  · {app.time}
                                </p>
                                <span
                                  className="text-[10px] py-[2px] px-2 rounded-full font-medium"
                                  style={{
                                    background: `${typeColor}18`,
                                    color: typeColor,
                                    border: `1px solid ${typeColor}30`,
                                  }}
                                >
                                  {app.type}
                                </span>
                              </div>
                              <p className="text-xs text-text-secondary mt-1">
                                {app.doctor} · {app.department}
                              </p>
                              <p className="text-[11px] text-text-tertiary mt-[2px]">
                                {app.clinicName} · {app.duration} min
                              </p>
                            </div>
                            <span
                              className="flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-[8px] shrink-0"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {sc.icon} {app.status}
                            </span>
                          </div>
                          <div className="flex gap-[6px] flex-wrap">
                            <span
                              className={cn(
                                "text-[10px] py-[2px] px-[6px] rounded-[6px]",
                                app.intakeComplete
                                  ? "bg-[rgba(14,165,233,0.1)] text-[#0ea5e9] border border-[rgba(14,165,233,0.2)]"
                                  : "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]",
                              )}
                            >
                              {app.intakeComplete ? "✓ Intake" : "⏳ Intake Pending"}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] py-[2px] px-[6px] rounded-[6px]",
                                app.insuranceVerified
                                  ? "bg-[rgba(14,165,233,0.1)] text-[#0ea5e9] border border-[rgba(14,165,233,0.2)]"
                                  : "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]",
                              )}
                            >
                              {app.insuranceVerified
                                ? "✓ Insurance Verified"
                                : "✗ Insurance Unverified"}
                            </span>
                            <span className="text-[10px] py-[2px] px-[6px] rounded-[6px] bg-bg-secondary text-text-tertiary border border-border-primary">
                              {app.insuranceProvider}
                            </span>
                          </div>
                          {app.notes && (
                            <p className="text-[11px] text-[#f59e0b] mt-2 py-[6px] px-[10px] rounded-[8px] bg-[rgba(245,158,11,0.08)]">
                              ⚠️ {app.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-tertiary">
                    <Calendar size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No appointments on record</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {billing ? (
                  <>
                    <div className="p-4 rounded-[16px] bg-[rgba(60,131,246,0.06)] border border-[rgba(60,131,246,0.2)]">
                      <div className="flex items-center gap-2 mb-[14px]">
                        <Shield size={15} className="text-accent-blue" />
                        <h3 className="text-sm font-semibold text-text-primary">
                          Insurance Details
                        </h3>
                        <span
                          className={cn(
                            "ml-auto text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px]",
                            billing.insuranceCovered > 0
                              ? "bg-[rgba(14,165,233,0.1)] text-[#0ea5e9]"
                              : "bg-[rgba(239,68,68,0.1)] text-[#ef4444]",
                          )}
                        >
                          {billing.insuranceCovered > 0 ? "Covered" : "Unverified"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-[10px]">
                        {[
                          { label: "Provider", value: billing.insuranceProvider },
                          { label: "Policy Number", value: billing.policyNumber },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-[10px] px-3 rounded-[10px] bg-bg-card">
                            <p className="text-[11px] text-text-tertiary mb-[3px]">{label}</p>
                            <p className="text-[13px] font-semibold text-text-primary">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-3">
                        Billing History
                      </h3>
                      <div className="flex flex-col gap-2">
                        {billingRecords.map(r => (
                          <div
                            key={r.id}
                            className="p-[14px] rounded-[14px] bg-bg-tertiary border border-border-primary"
                          >
                            <div className="flex items-start justify-between gap-3 mb-[10px]">
                              <div>
                                <p className="text-[13px] font-semibold text-text-primary">
                                  {r.procedure}
                                </p>
                                <p className="text-[11px] text-text-tertiary mt-[2px]">
                                  {r.department} ·{" "}
                                  {new Date(r.visitDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <span
                                className="text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px] shrink-0"
                                style={{
                                  background: CLAIM_STATUS_COLORS[r.claimStatus].bg,
                                  color: CLAIM_STATUS_COLORS[r.claimStatus].color,
                                }}
                              >
                                {r.claimStatus}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                {
                                  label: "Total",
                                  value: `₹${r.totalAmount.toLocaleString("en-IN")}`,
                                },
                                {
                                  label: "Insurance",
                                  value: `₹${r.insuranceCovered.toLocaleString("en-IN")}`,
                                },
                                {
                                  label: "Patient Due",
                                  value: `₹${r.patientDue.toLocaleString("en-IN")}`,
                                },
                              ].map(({ label, value }) => (
                                <div key={label}>
                                  <p className="text-[10px] text-text-tertiary mb-[2px]">{label}</p>
                                  <p className="text-[13px] font-bold text-text-primary">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-text-tertiary">
                    <Shield size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No billing records found</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === "prescriptions" && (
              <motion.div
                key="prescriptions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {prescriptions.length > 0 ? (
                  <div className="flex flex-col gap-[10px]">
                    {prescriptions.map(rx => {
                      const sc = PRESCRIPTION_COLORS[rx.status];
                      return (
                        <div
                          key={rx.id}
                          className="p-[14px] rounded-[14px] bg-bg-tertiary border border-border-primary"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">
                                {rx.medication}{" "}
                                <span className="text-[13px] font-normal text-text-secondary">
                                  {rx.dosage}
                                </span>
                              </p>
                              <p className="text-xs text-text-secondary mt-[3px]">
                                {rx.frequency} · {rx.duration}
                              </p>
                            </div>
                            <span
                              className="text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px] shrink-0"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {rx.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="text-[11px] text-text-tertiary">
                              {rx.prescribedBy} ·{" "}
                              {new Date(rx.prescribedDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            {rx.refillsLeft !== undefined && rx.status === "Active" && (
                              <span
                                className={cn(
                                  "text-[11px] py-[2px] px-2 rounded-[6px]",
                                  rx.refillsLeft > 0
                                    ? "bg-[rgba(60,131,246,0.1)] text-accent-blue"
                                    : "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]",
                                )}
                              >
                                {rx.refillsLeft > 0
                                  ? `${rx.refillsLeft} refill${rx.refillsLeft > 1 ? "s" : ""} left`
                                  : "No refills"}
                              </span>
                            )}
                          </div>
                          {rx.notes && (
                            <p className="text-[11px] text-[#f59e0b] mt-[6px] py-[6px] px-[10px] rounded-[8px] bg-[rgba(245,158,11,0.08)]">
                              ⚠️ {rx.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-tertiary">
                    <Pill size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No prescriptions on record</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
