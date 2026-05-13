import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import type { KpiCardProps } from "./types";

export const KpiCard = ({
  title,
  value,
  rawValue,
  prefix = "",
  suffix = "",
  format,
  sub,
  change,
  positive = true,
  icon,
  color = "var(--accent-blue)",
  iconBg = true,
  onClick,
  showArrow,
  active,
  size = "md",
  variants,
}: KpiCardProps) => {
  const [hovered, setHovered] = useState(false);
  const count = useCountUp(rawValue ?? 0);
  const displayValue =
    rawValue !== undefined
      ? format
        ? format(count)
        : `${prefix}${count}${suffix}`
      : (value ?? "");

  const sm = size === "sm";

  return (
    <motion.div
      variants={variants}
      className={cn(
        "glass-card relative overflow-hidden",
        sm ? "rounded-16 p-[18px]" : "rounded-20 p-6",
      )}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        ...(active ? { border: `1px solid ${color}50` } : {}),
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: active ? 0.07 : 0.05,
          background: `radial-gradient(circle at top right, ${color}, transparent)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              "font-medium text-text-secondary",
              sm ? "text-[12px] mb-[10px]" : "text-[13px] mb-2",
            )}
          >
            {title}
          </p>
          <p
            className={cn("font-bold leading-none", sm ? "text-[28px]" : "text-[32px]")}
            style={{ color: sm ? color : "var(--text-primary)" }}
          >
            {displayValue}
          </p>
          {change ? (
            <p
              className={cn(
                "text-xs mt-2 flex items-center gap-1",
                positive ? "text-accent-cyan" : "text-accent-red",
              )}
            >
              <span>{positive ? "↑" : "↓"}</span>
              {change}
            </p>
          ) : sub ? (
            <p className={cn("text-text-tertiary mt-[6px]", sm ? "text-[11px]" : "text-xs")}>
              {sub}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("shrink-0", sm ? "p-[10px] rounded-[10px]" : "p-3 rounded-12")}
            style={{ background: iconBg ? `${color}18` : "transparent", color }}
          >
            {icon}
          </motion.div>
          {showArrow && (
            <div className="flex items-center gap-[3px] text-accent-cyan text-[11px]">
              View <ChevronRight size={12} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
