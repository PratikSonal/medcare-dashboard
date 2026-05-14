import { cn } from "@/lib/utils";
import type { AuthInputProps } from "./types";

export const AuthInput = ({
  inputId,
  label,
  icon: Icon,
  headerRight,
  rightElement,
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
        className={cn(
          "w-full bg-bg-secondary border border-border-primary rounded-12",
          "py-3 px-4 pl-[38px] text-sm text-text-primary placeholder:text-text-tertiary",
          "outline-none focus:border-accent-blue transition-colors duration-200",
          "font-sans box-border",
          rightElement && "pr-[38px]",
          className,
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  </div>
);
