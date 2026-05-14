import { memo } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Pill, AlertTriangle } from "lucide-react";
import { cn } from "@/utils";
import { PRESCRIPTION_COLORS } from "../constants";
import type { Prescription } from "@/features/patients/types";

interface Props {
  prescriptions: Prescription[];
}

export const PrescriptionsTab = memo(({ prescriptions }: Props): React.ReactElement => (
  <motion.div
    key="prescriptions"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    {prescriptions.length > 0 ? (
      <div className="flex flex-col gap-[10px]">
        {prescriptions.map(rx => {
          const sc = PRESCRIPTION_COLORS[rx.status];
          return (
            <div
              key={rx.id}
              className="p-[14px] rounded-[14px] bg-bg-tertiary border border-border-primary"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {rx.medication}{" "}
                    <span className="text-[13px] font-normal text-text-secondary">{rx.dosage}</span>
                  </p>
                  <p className="text-xs text-text-secondary mt-[3px]">
                    {rx.frequency} · {rx.duration}
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px] shrink-0"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {rx.status}
                </span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-[11px] text-text-tertiary">
                  {rx.prescribedBy} ·{" "}
                  {format(parseISO(rx.prescribedDate), "d MMM yyyy")}
                </p>
                {rx.refillsLeft !== undefined && rx.status === "Active" && (
                  <span
                    className={cn(
                      "text-[11px] py-[2px] px-2 rounded-[6px]",
                      rx.refillsLeft > 0
                        ? "bg-[var(--accent-blue-subtle)] text-accent-blue"
                        : "bg-[var(--accent-yellow-subtle)] text-accent-yellow",
                    )}
                  >
                    {rx.refillsLeft > 0
                      ? `${rx.refillsLeft} refill${rx.refillsLeft > 1 ? "s" : ""} left`
                      : "No refills"}
                  </span>
                )}
              </div>
              {rx.notes && (
                <p className="flex items-center gap-[5px] text-[11px] text-accent-yellow mt-[6px] py-[6px] px-[10px] rounded-[8px] bg-[var(--accent-yellow-muted)]">
                  <AlertTriangle size={11} /> {rx.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12 text-text-tertiary">
        <Pill size={36} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No prescriptions on record</p>
      </div>
    )}
  </motion.div>
));
