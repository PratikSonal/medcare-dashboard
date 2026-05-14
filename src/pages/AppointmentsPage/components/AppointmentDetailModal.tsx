import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { AppointmentDetailModalProps } from "./types";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "../statusConfig";

export const AppointmentDetailModal = ({ app, onClose }: AppointmentDetailModalProps) => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);

  const handleViewPatient = () => {
    if (!app) return;
    const patient = patients.find(p => p.id === app.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    onClose();
  };

  return (
    <AnimatePresence>
      {app && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-[520px] rounded-[24px] bg-bg-secondary border border-border-primary overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 bg-bg-tertiary border-b border-border-primary">
              <div className="flex items-center gap-[14px]">
                <Avatar initials={app.patientAvatar} size={48} radius="16px" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[18px] font-bold text-text-primary">{app.patientName}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-text-secondary">DOB: {app.dob}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Phone size={11} /> {app.phone}
                    </span>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-medium py-1 px-[10px] rounded-[10px] shrink-0"
                  style={{
                    background: STATUS_CONFIG[app.status].bg,
                    color: STATUS_CONFIG[app.status].color,
                  }}
                >
                  {STATUS_CONFIG[app.status].icon} {app.status}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-[10px]">
                {[
                  {
                    label: "Date",
                    value: new Date(app.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }),
                  },
                  { label: "Time", value: `${app.time} (${app.duration} min)` },
                  { label: "Doctor", value: app.doctor },
                  { label: "Visit Type", value: app.type },
                  { label: "Clinic", value: app.clinicName },
                  { label: "Insurance Provider", value: app.insuranceProvider },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-[12px] bg-bg-tertiary">
                    <p className="text-[11px] text-text-tertiary mb-1">{label}</p>
                    <p className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div
                  className={cn(
                    "flex-1 p-[14px] rounded-[14px] text-center",
                    app.intakeComplete
                      ? "bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.2)]"
                      : "bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]",
                  )}
                >
                  <div className="flex justify-center mb-1">
                    {app.intakeComplete ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      app.intakeComplete ? "text-accent-cyan" : "text-accent-yellow",
                    )}
                  >
                    Patient Intake
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-[2px]">
                    {app.intakeComplete ? "Complete" : "Pending"}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex-1 p-[14px] rounded-[14px] text-center",
                    app.insuranceVerified
                      ? "bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.2)]"
                      : "bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]",
                  )}
                >
                  <div className="flex justify-center mb-1">
                    {app.insuranceVerified ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      app.insuranceVerified ? "text-accent-cyan" : "text-accent-red",
                    )}
                  >
                    Insurance
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-[2px]">
                    {app.insuranceVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>

              {app.notes && (
                <div className="p-[14px] rounded-[14px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]">
                  <p className="flex items-center gap-[5px] text-xs font-semibold text-accent-yellow mb-[6px]"><AlertTriangle size={12} /> Doctor Notes</p>
                  <p className="text-[13px] text-text-secondary leading-[1.6]">{app.notes}</p>
                </div>
              )}

              <div className="flex gap-[10px]">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-[12px] border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleViewPatient}
                  className="flex-1 py-3 rounded-[12px] border-0 text-white cursor-pointer font-sans text-sm font-semibold"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  View Patient
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
