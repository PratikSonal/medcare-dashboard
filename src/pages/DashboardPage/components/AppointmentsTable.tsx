import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { item } from "../constants";

export const AppointmentsTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patients = useAppSelector((s) => s.patients.patients);
  const appointments = useAppSelector((s) => s.appointments.appointments);

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === "2026-05-11"),
    [appointments],
  );

  return (
    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="flex items-center gap-[10px] mb-5">
        <Calendar size={16} className="text-[#3c83f6]" />
        <h3 className="text-[15px] font-semibold text-text-primary">Today's Appointments</h3>
        <span className="text-xs text-text-tertiary">11 May 2026</span>
        <button
          onClick={() => navigate("/appointments")}
          className="ml-auto flex items-center gap-[3px] text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans font-medium"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="border-b border-border-primary">
              {["Time", "Patient", "Type", "Doctor", "Clinic", "Intake & Insurance", "Status"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((app, i) => {
              const sc = APPT_STATUS_COLORS[app.status];
              const typeColor = APPT_TYPE_COLORS[app.type] || "var(--accent-blue)";
              const patient = patients.find((p) => p.id === app.patientId);
              return (
                <motion.tr
                  key={app.id}
                  onClick={() => patient && dispatch(setSelectedPatient(patient))}
                  whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
                  className={cn(
                    "cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary",
                    i < todayAppointments.length - 1 && "border-b border-border-primary",
                  )}
                >
                  <td className="px-3 py-3 font-bold text-text-primary whitespace-nowrap">{app.time}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        {app.patientAvatar}
                      </div>
                      <span className="font-medium text-text-primary whitespace-nowrap">{app.patientName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="text-[11px] px-2 py-[2px] rounded-full font-medium whitespace-nowrap"
                      style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}
                    >
                      {app.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-text-secondary text-[13px] whitespace-nowrap">{app.doctor}</td>
                  <td className="px-3 py-3 text-text-secondary text-xs max-w-[180px]">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">{app.clinicName}</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <span
                        className="text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap"
                        style={{ background: app.intakeComplete ? "rgba(14,165,233,0.1)" : "rgba(245,158,11,0.1)", color: app.intakeComplete ? "#0ea5e9" : "#f59e0b" }}
                      >
                        {app.intakeComplete ? "✓ Intake" : "⏳ Intake"}
                      </span>
                      <span
                        className="text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap"
                        style={{ background: app.insuranceVerified ? "rgba(14,165,233,0.1)" : "rgba(239,68,68,0.1)", color: app.insuranceVerified ? "#0ea5e9" : "#ef4444" }}
                      >
                        {app.insuranceVerified ? "✓ Ins." : "✗ Ins."}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[11px] font-medium px-2 py-[3px] rounded-[8px] whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>
                      {app.status}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
