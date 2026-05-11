import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:   'bg-accent-blue text-white border-0 shadow-[var(--glow-blue)]',
  secondary: 'bg-accent-green text-white border-0',
  ghost:     'bg-transparent text-text-secondary border-0',
  danger:    'bg-[rgba(239,68,68,0.1)] text-accent-red border border-[rgba(239,68,68,0.3)]',
  outline:   'bg-transparent text-text-primary border border-border-primary',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-[6px] text-xs rounded-[8px]',
  md: 'px-4 py-2 text-sm rounded-[10px]',
  lg: 'px-6 py-3 text-base rounded-12',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium font-sans transition-all duration-200',
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
