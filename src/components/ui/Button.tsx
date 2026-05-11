import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: 'var(--accent-blue)', color: 'white', border: 'none', boxShadow: 'var(--glow-blue)' },
  secondary: { background: 'var(--accent-green)', color: 'white', border: 'none', boxShadow: 'var(--glow-green)' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: 'none' },
  danger: { background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.3)' },
  outline: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '8px' },
  md: { padding: '8px 16px', fontSize: '14px', borderRadius: '10px' },
  lg: { padding: '12px 24px', fontSize: '16px', borderRadius: '12px' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontWeight: 500, cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
          opacity: (disabled || loading) ? 0.5 : 1,
          transition: 'all 200ms ease', fontFamily: 'inherit',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      >
        {loading && (
          <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
