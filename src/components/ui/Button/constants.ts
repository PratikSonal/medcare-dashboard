export const variantClasses: Record<string, string> = {
  primary: "bg-accent-blue text-white border-0 shadow-[var(--glow-blue)]",
  secondary: "bg-accent-green text-white border-0",
  ghost: "bg-transparent text-text-secondary border-0",
  danger: "bg-[var(--accent-red-subtle)] text-accent-red border border-[rgba(239,68,68,0.3)]",
  outline: "bg-transparent text-text-primary border border-border-primary",
};

export const sizeClasses: Record<string, string> = {
  sm: "px-3 py-[6px] text-xs rounded-[8px]",
  md: "px-4 py-2 text-sm rounded-[10px]",
  lg: "px-6 py-3 text-base rounded-12",
};
