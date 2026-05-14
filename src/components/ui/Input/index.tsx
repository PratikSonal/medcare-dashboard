import { forwardRef, memo } from "react";

import { cn } from "@/utils";

import type { InputProps } from "./types";

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-bg-secondary border border-border-primary rounded-xl",
            "px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary",
            "outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-accent-red focus:border-accent-red focus:ring-accent-red",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  ),
));
Input.displayName = "Input";
