import { AlertCircle } from "lucide-react";
import { cn } from "@/utils";
import type { AuthInputProps } from "./types";

export const AuthInput = ({
  inputId,
  label,
  icon: Icon,
  headerRight,
  rightElement,
  error,
  className,
  ...props
}: AuthInputProps): React.ReactElement => (
  <div className="flex flex-col gap-[6px]">
    <div className="flex items-center justify-between">
      <label htmlFor={inputId} className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      {headerRight}
    </div>
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
      />
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "w-full bg-bg-secondary border border-border-primary rounded-12",
          "py-3 px-4 pl-[38px] text-sm text-text-primary placeholder:text-text-tertiary",
          "outline-none focus:border-accent-blue transition-colors duration-200",
          "font-sans box-border",
          error && "border-accent-red focus:border-accent-red",
          rightElement && "pr-[38px]",
          className,
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {error && (
      <p id={`${inputId}-error`} className="flex items-center gap-1 text-[12px] text-accent-red">
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);
