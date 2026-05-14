import { memo } from "react";

import { cn } from "@/utils";

import { variantClasses } from "./constants";
import type { BadgeProps } from "./types";

export const Badge = memo(({ children, variant = "default", className }: BadgeProps): React.ReactElement => (
  <span
    className={cn(
      "inline-flex items-center px-[10px] py-[2px] rounded-full text-xs font-medium",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
));
