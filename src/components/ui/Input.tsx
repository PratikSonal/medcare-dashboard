import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">{icon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl',
              'px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
              'focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)]',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-[var(--accent-red)] focus:border-[var(--accent-red)] focus:ring-[var(--accent-red)]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--accent-red)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
