import { memo } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
  X,
} from "lucide-react";
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS } from "@/features/appointments/constants";
import { cn } from "@/utils";
import type { Appointment } from "@/features/appointments/types";

const APP_STATUS: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Confirmed: { ...APPT_STATUS_COLORS.Confirmed, icon: <CheckCircle size={11} /> },
  Pending: { ...APPT_STATUS_COLORS.Pending, icon: <AlertCircle size={11} /> },
  Completed: { ...APPT_STATUS_COLORS.Completed, icon: <CheckCircle size={11} /> },
  Cancelled: { ...APPT_STATUS_COLORS.Cancelled, icon: <XCircle size={11} /> },
  "No-Show": { ...APPT_STATUS_COLORS["No-Show"], icon: <XCircle size={11} /> },
};

interface Props {
  appointments: Appointment[];
}

export const AppointmentsTab = memo(({ appointments }: Props): React.ReactElement => (
  <motion.div
    key="appointments"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    {appointments.length > 0 ? (
      <div className="flex flex-col gap-[10px]">
        {appointments.map(appointment => {
          const sc = APP_STATUS[appointment.status];
          const typeColor = APPT_TYPE_COLORS[appointment.type] || "var(--accent-blue)";
          return (
            <div
              key={appointment.id}
              className="p-4 rounded-[14px] bg-bg-tertiary border border-border-primary"
              style={{ borderLeft: `3px solid ${typeColor}` }}
            >
              <div className="flex items-start justify-between gap-3 mb-[10px]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text-primary">
                      {format(parseISO(appointment.date), "EEE, d MMM")}{" "}
                      · {appointment.time}
                    </p>
                    <span
                      className="text-[10px] py-[2px] px-2 rounded-full font-medium"
                      style={{
                        background: `${typeColor}18`,
                        color: typeColor,
                        border: `1px solid ${typeColor}30`,
                      }}
                    >
                      {appointment.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {appointment.doctor} · {appointment.department}
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-[2px]">
                    {appointment.clinicName} · {appointment.duration} min
                  </p>
                </div>
                <span
                  className="flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-[8px] shrink-0"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {sc.icon} {appointment.status}
                </span>
              </div>
              <div className="flex gap-[6px] flex-wrap">
                <span
                  className={cn(
                    "flex items-center gap-[3px] text-[10px] py-[2px] px-[6px] rounded-[6px]",
                    appointment.intakeComplete
                      ? "bg-[var(--accent-cyan-subtle)] text-accent-cyan border border-[var(--accent-cyan-border)]"
                      : "bg-[var(--accent-yellow-subtle)] text-accent-yellow border border-[var(--accent-yellow-border)]",
                  )}
                >
                  {appointment.intakeComplete ? (
                    <><Check size={9} /> Intake</>
                  ) : (
                    <><Clock size={9} /> Intake Pending</>
                  )}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-[3px] text-[10px] py-[2px] px-[6px] rounded-[6px]",
                    appointment.insuranceVerified
                      ? "bg-[var(--accent-cyan-subtle)] text-accent-cyan border border-[var(--accent-cyan-border)]"
                      : "bg-[var(--accent-red-subtle)] text-accent-red border border-[var(--accent-red-border)]",
                  )}
                >
                  {appointment.insuranceVerified ? (
                    <><Check size={9} /> Insurance Verified</>
                  ) : (
                    <><X size={9} /> Insurance Unverified</>
                  )}
                </span>
                <span className="text-[10px] py-[2px] px-[6px] rounded-[6px] bg-bg-secondary text-text-tertiary border border-border-primary">
                  {appointment.insuranceProvider}
                </span>
              </div>
              {appointment.notes && (
                <p className="flex items-center gap-[5px] text-[11px] text-accent-yellow mt-2 py-[6px] px-[10px] rounded-[8px] bg-[var(--accent-yellow-muted)]">
                  <AlertTriangle size={11} /> {appointment.notes}
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
));
