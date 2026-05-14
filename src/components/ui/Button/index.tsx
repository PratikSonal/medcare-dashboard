import { forwardRef, memo } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";
import type { ButtonProps } from "./types";
import { variantClasses, sizeClasses } from "./constants";

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium font-sans transition-all duration-200",
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {children}
    </button>
  ),
));
Button.displayName = "Button";
