import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Appointment } from "@/features/appointments/types";
import { Avatar } from "@/components/ui/Avatar";

interface Props {
  doctors: string[];
  todayAll: Appointment[];
}

export const DoctorSchedules = ({ doctors, todayAll }: Props) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="glass-card rounded-20 p-5"
  >
    <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
      <User size={15} className="text-accent-blue" /> Doctor Schedules
    </h3>
    <div className="flex flex-col gap-[10px]">
      {doctors.map(doc => {
        const docApps = todayAll.filter(a => a.doctor === doc);
        const confirmed = docApps.filter(a => a.status === "Confirmed").length;
        return (
          <motion.div
            key={doc}
            whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex items-center justify-between py-[10px] px-3 rounded-[12px] bg-bg-tertiary"
          >
            <div className="flex items-center gap-[10px]">
              <Avatar initials={doc.split(" ").slice(-1)[0][0]} size={30} radius="50%" />
              <div>
                <p className="text-xs font-semibold text-text-primary">{doc.replace("Dr. ", "")}</p>
                <p className="text-[10px] text-text-tertiary">{docApps.length} today</p>
              </div>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[60px] h-1 rounded-full bg-border-primary overflow-hidden">
                <div
                  className="h-full bg-accent-blue rounded-full"
                  style={{
                    width: `${docApps.length > 0 ? (confirmed / docApps.length) * 100 : 0}%`,
                    transition: "width 600ms ease",
                  }}
                />
              </div>
              <span className="text-[10px] text-text-tertiary">
                {confirmed}/{docApps.length}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);
