import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { TimeSlotsProps } from "./types";
import { cn } from "@/utils";
import { STATUS_CONFIG } from "../statusConfig";

export const TimeSlots = ({ todayAll }: TimeSlotsProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="glass-card rounded-20 p-5"
  >
    <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
      <Clock size={15} className="text-accent-cyan" /> Time Slots
    </h3>
    {todayAll.length === 0 ? (
      <p className="text-xs text-text-tertiary text-center py-3">No appointments today</p>
    ) : (
      todayAll.map((app, i) => (
        <div
          key={app.id}
          className={cn(
            "flex items-center gap-[10px] py-[7px]",
            i < todayAll.length - 1 && "border-b border-border-primary",
          )}
        >
          <span className="text-[11px] text-text-tertiary w-10 shrink-0">{app.time}</span>
          <div
            className="flex-1 py-1 px-[10px] rounded-[8px] text-[11px] font-medium overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              background: STATUS_CONFIG[app.status].bg,
              color: STATUS_CONFIG[app.status].color,
            }}
          >
            {app.patientName}
          </div>
        </div>
      ))
    )}
  </motion.div>
);
