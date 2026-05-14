import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { BillingDetailModalProps } from "./types";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import { updateClaimStatus } from "@/features/billing/billingSlice";
import { Avatar } from "@/components/ui/Avatar";
import { CLAIM_STATUS_COLORS } from "@/features/billing/constants";
import { ALL_STATUSES } from "../constants";

export const BillingDetailModal = ({ record, onClose }: BillingDetailModalProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);

  const handleViewProfile = () => {
    if (!record) return;
    const patient = patients.find(p => p.id === record.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    onClose();
  };

  return (
    <AnimatePresence>
      {record && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center z-[1000] p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card rounded-[24px] p-8 w-full max-w-[540px] max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar initials={record.patientAvatar} size={44} radius="50%" />
                <div>
                  <p className="text-[17px] font-bold text-text-primary">{record.patientName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-[2px] rounded-[6px] bg-[rgba(60,131,246,0.1)] text-accent-blue font-medium">
                      {record.department}
                    </span>
                    <span className="text-[11px] text-text-tertiary">{record.policyNumber}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-border-primary bg-transparent text-text-secondary cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary">
                <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">
                  Visit Date
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {new Date(record.visitDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary">
                <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">
                  Doctor
                </p>
                <p className="text-sm font-semibold text-text-primary">{record.doctor}</p>
              </div>
            </div>

            <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary mb-5">
              <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">
                Procedure
              </p>
              <p className="text-sm font-medium text-text-primary">{record.procedure}</p>
              <p className="text-[11px] text-text-tertiary mt-1">{record.insuranceProvider}</p>
            </div>

            <div className="grid grid-cols-3 gap-[10px] mb-5">
              {[
                {
                  label: "Total Billed",
                  value: `₹${record.totalAmount.toLocaleString("en-IN")}`,
                  color: "var(--accent-blue)",
                },
                {
                  label: "Ins. Covered",
                  value: `₹${record.insuranceCovered.toLocaleString("en-IN")}`,
                  color: "var(--accent-cyan)",
                },
                {
                  label: "Patient Due",
                  value: `₹${record.patientDue.toLocaleString("en-IN")}`,
                  color: record.patientDue > 50000 ? "var(--accent-red)" : "var(--accent-purple)",
                },
              ].map(field => (
                <div
                  key={field.label}
                  className="px-[10px] py-[14px] rounded-12 bg-bg-secondary text-center"
                  style={{ border: `1px solid ${field.color}30` }}
                >
                  <p className="text-[10px] text-text-tertiary mb-[6px] uppercase tracking-[0.04em]">
                    {field.label}
                  </p>
                  <p className="text-[15px] font-bold" style={{ color: field.color }}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-[13px] font-semibold text-text-secondary mb-[10px]">
                Update Claim Status
              </p>
              <div className="flex gap-2 flex-wrap">
                {ALL_STATUSES.map(status => {
                  const isActive = record.claimStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => dispatch(updateClaimStatus({ id: record.id, status }))}
                      className="px-4 py-[6px] rounded-[10px] text-[13px] cursor-pointer font-sans transition-all duration-150"
                      style={{
                        border: `1px solid ${isActive ? CLAIM_STATUS_COLORS[status].color : "var(--border-primary)"}`,
                        background: isActive ? CLAIM_STATUS_COLORS[status].bg : "transparent",
                        color: isActive ? CLAIM_STATUS_COLORS[status].color : "var(--text-secondary)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-[10px] justify-end pt-4 border-t border-border-primary">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-[10px] rounded-12 border border-border-primary bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer font-sans"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleViewProfile}
                className="px-5 py-[10px] rounded-12 border-0 text-white text-[13px] font-semibold cursor-pointer font-sans [background:var(--gradient-primary)]"
              >
                View Patient Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
