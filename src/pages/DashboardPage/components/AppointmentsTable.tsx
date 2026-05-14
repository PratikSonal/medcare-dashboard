import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Check, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS } from "@/features/appointments/constants";
import { cn } from "@/utils";
import { item, TODAY_DATE } from "../constants";
import type { Appointment } from "@/features/appointments/types";
import type { Patient } from "@/features/patients/types";

interface AppointmentRowProps {
  app: Appointment;
  patient: Patient | undefined;
  isLast: boolean;
}

const AppointmentRow = memo(({ app, patient, isLast }: AppointmentRowProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const statusStyle = APPT_STATUS_COLORS[app.status];
  const typeColor = APPT_TYPE_COLORS[app.type] || "var(--accent-blue)";
  const intakeStyle = app.intakeComplete ? APPT_STATUS_COLORS.Completed : APPT_STATUS_COLORS.Pending;
  const insuranceStyle = app.insuranceVerified ? APPT_STATUS_COLORS.Completed : APPT_STATUS_COLORS["No-Show"];

  const handleRowClick = useCallback(() => {
    if (patient) dispatch(setSelectedPatient(patient));
  }, [patient, dispatch]);

  return (
    <motion.tr
      onClick={handleRowClick}
      whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
      className={cn(
        "cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary",
        !isLast && "border-b border-border-primary",
      )}
    >
      <td className="px-3 py-3 font-bold text-text-primary whitespace-nowrap">{app.time}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 [background:var(--gradient-primary)]">
            {app.patientAvatar}
          </div>
          <span className="font-medium text-text-primary whitespace-nowrap">{app.patientName}</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <span
          className="text-[11px] px-2 py-[2px] rounded-full font-medium whitespace-nowrap"
          style={{
            background: `${typeColor}18`,
            color: typeColor,
            border: `1px solid ${typeColor}30`,
          }}
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
            className="flex items-center gap-[3px] text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap"
            style={{ background: intakeStyle.bg, color: intakeStyle.color }}
          >
            {app.intakeComplete ? <><Check size={9} /> Intake</> : <><Clock size={9} /> Intake</>}
          </span>
          <span
            className="flex items-center gap-[3px] text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap"
            style={{ background: insuranceStyle.bg, color: insuranceStyle.color }}
          >
            {app.insuranceVerified ? <><Check size={9} /> Ins.</> : <><X size={9} /> Ins.</>}
          </span>
        </div>
      </td>
      <td className="px-3 py-3">
        <span
          className="text-[11px] font-medium px-2 py-[3px] rounded-[8px] whitespace-nowrap"
          style={{ background: statusStyle.bg, color: statusStyle.color }}
        >
          {app.status}
        </span>
      </td>
    </motion.tr>
  );
});

export const AppointmentsTable = memo((): React.ReactElement => {
  const navigate = useNavigate();
  const patients = useAppSelector(s => s.patients.patients);
  const appointments = useAppSelector(s => s.appointments.appointments);

  const todayAppointments = useMemo(
    () => appointments.filter(a => a.date === TODAY_DATE),
    [appointments],
  );

  const handleViewAll = useCallback(() => navigate("/appointments"), [navigate]);

  return (
    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="flex items-center gap-[10px] mb-5">
        <Calendar size={16} className="text-accent-blue" />
        <h3 className="text-[15px] font-semibold text-text-primary">Today's Appointments</h3>
        <span className="text-xs text-text-tertiary">11 May 2026</span>
        <button
          type="button"
          onClick={handleViewAll}
          className="ml-auto flex items-center gap-[3px] text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans font-medium"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border-primary">
              {["Time", "Patient", "Type", "Doctor", "Clinic", "Intake & Insurance", "Status"].map(h => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((app, i) => (
              <AppointmentRow
                key={app.id}
                app={app}
                patient={patients.find(p => p.id === app.patientId)}
                isLast={i === todayAppointments.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});
