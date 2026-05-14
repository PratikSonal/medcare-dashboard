import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle, XCircle, Phone, UserX, Check, X, Clock, AlertTriangle } from "lucide-react";
import type { AppointmentListProps } from "./types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateAppointmentStatus } from "@/features/appointments/appointmentsSlice";
import { addToast } from "@/features/ui/uiSlice";
import { APPT_TYPE_COLORS } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { container, item } from "../constants";
import { STATUS_CONFIG } from "../statusConfig";

export const AppointmentList = ({
  todayApps,
  dateKey,
  filterStatus,
  onSelectApp,
}: AppointmentListProps) => {
  const dispatch = useAppDispatch();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dateKey + filterStatus}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-[10px]"
      >
        {todayApps.length === 0 ? (
          <motion.div variants={item} className="text-center py-12 text-text-tertiary">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-[15px] font-medium">No appointments for this day</p>
          </motion.div>
        ) : (
          todayApps.map(app => {
            const status = STATUS_CONFIG[app.status];
            const typeColor = APPT_TYPE_COLORS[app.type] || "var(--accent-blue)";
            return (
              <motion.div
                key={app.id}
                variants={item}
                onClick={() => onSelectApp(app)}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="glass-card rounded-[16px] p-4 cursor-pointer"
                style={{ borderLeft: `3px solid ${typeColor}` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-center min-w-[48px]">
                      <p className="text-[15px] font-bold text-text-primary">{app.time}</p>
                      <p className="text-[10px] text-text-tertiary mt-[2px]">{app.duration}min</p>
                    </div>
                    <div className="w-px h-10 bg-border-primary shrink-0" />
                    <Avatar initials={app.patientAvatar} size={36} radius="50%" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-text-primary">{app.patientName}</p>
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
                      <p className="text-xs text-text-secondary mt-[2px]">
                        {app.doctor} · {app.department}
                      </p>
                      <div className="flex items-center gap-1 mt-[3px]">
                        <Phone size={10} className="text-text-tertiary" />
                        <p className="text-[11px] text-text-tertiary">{app.phone}</p>
                      </div>
                      {app.notes && (
                        <p className="flex items-center gap-1 text-[11px] text-accent-yellow mt-1"><AlertTriangle size={10} /> {app.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-[8px]"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.icon} {status.label}
                    </span>
                    {(app.status === "Pending" || app.status === "Confirmed") && (
                      <div className="flex gap-1">
                        {app.status === "Pending" && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              dispatch(
                                updateAppointmentStatus({ id: app.id, status: "Confirmed" }),
                              );
                              dispatch(
                                addToast({
                                  message: `Appointment for ${app.patientName} confirmed.`,
                                  type: "success",
                                }),
                              );
                            }}
                            className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(14,165,233,0.35)] bg-[rgba(14,165,233,0.1)] text-accent-cyan cursor-pointer font-sans"
                          >
                            <CheckCircle size={10} /> Confirm
                          </button>
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            dispatch(updateAppointmentStatus({ id: app.id, status: "No-Show" }));
                            dispatch(
                              addToast({
                                message: `${app.patientName} marked as no-show.`,
                                type: "info",
                              }),
                            );
                          }}
                          className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(107,114,128,0.3)] bg-[rgba(107,114,128,0.08)] text-text-tertiary cursor-pointer font-sans"
                        >
                          <UserX size={10} /> No-show
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            dispatch(updateAppointmentStatus({ id: app.id, status: "Cancelled" }));
                            dispatch(
                              addToast({
                                message: `Appointment for ${app.patientName} cancelled.`,
                                type: "error",
                              }),
                            );
                          }}
                          className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] text-accent-red cursor-pointer font-sans"
                        >
                          <XCircle size={10} /> Cancel
                        </button>
                      </div>
                    )}
                    <div className="flex gap-[6px]">
                      <span
                        className={cn(
                          "flex items-center gap-[3px] text-[10px] py-[2px] px-[6px] rounded-[6px]",
                          app.intakeComplete
                            ? "bg-[rgba(14,165,233,0.1)] text-accent-cyan border border-[rgba(14,165,233,0.2)]"
                            : "bg-[rgba(245,158,11,0.1)] text-accent-yellow border border-[rgba(245,158,11,0.2)]",
                        )}
                      >
                        {app.intakeComplete ? <><Check size={9} /> Intake</> : <><Clock size={9} /> Intake</>}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-[3px] text-[10px] py-[2px] px-[6px] rounded-[6px]",
                          app.insuranceVerified
                            ? "bg-[rgba(14,165,233,0.1)] text-accent-cyan border border-[rgba(14,165,233,0.2)]"
                            : "bg-[rgba(239,68,68,0.1)] text-accent-red border border-[rgba(239,68,68,0.2)]",
                        )}
                      >
                        {app.insuranceVerified ? <><Check size={9} /> Insured</> : <><X size={9} /> Insurance</>}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </AnimatePresence>
  );
};
