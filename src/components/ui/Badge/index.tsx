import { cn } from "@/lib/utils";
import type { BadgeProps } from "./types";
import { variantClasses } from "./constants";

export const Badge = ({ children, variant = "default", className }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center px-[10px] py-[2px] rounded-full text-xs font-medium",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);
