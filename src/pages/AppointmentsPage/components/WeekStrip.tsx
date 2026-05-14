import { memo } from "react";
import { format, getDate } from "date-fns";
import { motion } from "framer-motion";
import type { WeekStripProps } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { cn } from "@/utils";
import { DAY_NAMES } from "../constants";
import { formatDateKey } from "../helpers";

export const WeekStrip = memo(({
  weekDays,
  baseDate,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: WeekStripProps): React.ReactElement => {
  const appointments = useAppSelector(s => s.appointments.appointments);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-20 p-5 mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary">
          {format(baseDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevWeek}
            className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border-primary bg-bg-tertiary cursor-pointer text-text-secondary"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={onNextWeek}
            className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border-primary bg-bg-tertiary cursor-pointer text-text-secondary"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const key = formatDateKey(day);
          const isSelected = key === formatDateKey(selectedDate);
          const appCount = appointments.filter(a => a.date === key).length;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onSelectDate(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center gap-[6px] py-3 px-2 rounded-[14px] border cursor-pointer transition-all duration-200 font-sans",
                isSelected
                  ? "border-accent-blue bg-[rgba(60,131,246,0.15)]"
                  : "border-transparent bg-bg-tertiary",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isSelected ? "text-accent-blue" : "text-text-tertiary",
                )}
              >
                {DAY_NAMES[i]}
              </span>
              <span
                className={cn(
                  "text-[18px] font-bold",
                  isSelected ? "text-accent-blue" : "text-text-primary",
                )}
              >
                {getDate(day)}
              </span>
              {appCount > 0 && (
                <span
                  className="text-[9px] font-bold leading-none py-[2px] px-[5px] rounded-full text-white"
                  style={{
                    background: isSelected
                      ? "var(--accent-blue)"
                      : appCount >= 6
                        ? "var(--accent-red)"
                        : appCount >= 4
                          ? "var(--accent-yellow)"
                          : "var(--accent-cyan)",
                  }}
                >
                  {appCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});
