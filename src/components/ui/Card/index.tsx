import { memo } from "react";

import { cn } from "@/utils";

import type { CardProps, StatCardProps } from "./types";

export const Card = memo(({ children, className, hover = false, onClick, style }: CardProps): React.ReactElement => (
  <div
    onClick={onClick}
    className={cn(
      "glass-card rounded-16 p-6 transition-all duration-200",
      (onClick || hover) && "cursor-pointer hover:-translate-y-0.5",
      className,
    )}
    style={style}
  >
    {children}
  </div>
));

export const StatCard = memo(({
  title,
  value,
  change,
  positive = true,
  icon,
  color = "var(--accent-blue)",
}: StatCardProps): React.ReactElement => (
  <Card hover className="relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-[13px] text-text-secondary mb-2">{title}</p>
        <p className="text-[32px] font-bold text-text-primary leading-none">{value}</p>
        {change && (
          <p
            className={cn(
              "text-xs mt-2 flex items-center gap-1",
              positive ? "text-accent-cyan" : "text-accent-red",
            )}
          >
            <span>{positive ? "↑" : "↓"}</span>
            {change}
          </p>
        )}
      </div>
      <div className="p-3 rounded-12 shrink-0" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
    </div>
  </Card>
));
