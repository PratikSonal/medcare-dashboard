interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  className?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  success: { background: 'rgba(16,188,131,0.12)', color: 'var(--accent-green)', border: '1px solid rgba(16,188,131,0.2)' },
  error: { background: 'rgba(239,68,68,0.12)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)' },
  warning: { background: 'rgba(245,158,11,0.12)', color: 'var(--accent-yellow)', border: '1px solid rgba(245,158,11,0.2)' },
  info: { background: 'rgba(60,131,246,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(60,131,246,0.2)' },
  outline: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' },
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, ...variantStyles[variant] }}
    >
      {children}
    </span>
  );
}
