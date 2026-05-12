import { motion } from "framer-motion";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import type { Appointment } from "@/types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateAppointmentChecks } from "@/features/appointments/appointmentsSlice";
import { addToast } from "@/features/ui/uiSlice";
import { Avatar } from "@/components/ui/Avatar";

interface Props {
  todayAll: Appointment[];
}

export const ActionRequired = ({ todayAll }: Props) => {
  const dispatch = useAppDispatch();
  const pending = todayAll.filter((a) => !a.intakeComplete || !a.insuranceVerified);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-20 p-5"
    >
      <h3 className="text-[15px] font-semibold text-text-primary mb-4">Action Required</h3>
      <div className="flex flex-col gap-2">
        {pending.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
            className="p-3 rounded-[12px] bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Avatar initials={app.patientAvatar} size={24} radius="50%" />
              <p className="text-xs font-semibold text-text-primary">{app.patientName}</p>
              <span className="text-[10px] text-text-tertiary ml-auto">{app.time}</span>
            </div>
            <div className="flex gap-[6px] flex-wrap">
              {!app.intakeComplete && (
                <button
                  onClick={() => {
                    dispatch(updateAppointmentChecks({ id: app.id, intakeComplete: true }));
                    dispatch(addToast({ message: `Intake completed for ${app.patientName}.`, type: "success" }));
                  }}
                  className="flex items-center gap-1 text-[10px] font-semibold py-[3px] px-2 rounded-[6px] bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] cursor-pointer font-sans"
                >
                  <ClipboardCheck size={10} /> Complete Intake
                </button>
              )}
              {!app.insuranceVerified && (
                <button
                  onClick={() => {
                    dispatch(updateAppointmentChecks({ id: app.id, insuranceVerified: true }));
                    dispatch(addToast({ message: `Insurance verified for ${app.patientName}.`, type: "success" }));
                  }}
                  className="flex items-center gap-1 text-[10px] font-semibold py-[3px] px-2 rounded-[6px] bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] cursor-pointer font-sans"
                >
                  <ShieldCheck size={10} /> Verify Insurance
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {pending.length === 0 && (
          <p className="text-[13px] text-text-tertiary text-center py-4">All clear for today</p>
        )}
      </div>
    </motion.div>
  );
};
