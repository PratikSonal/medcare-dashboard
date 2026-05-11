interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card ${className || ''}`}
      style={{ borderRadius: '16px', padding: '24px', cursor: onClick || hover ? 'pointer' : 'default', transition: 'all 250ms ease', ...style }}
      onMouseEnter={e => { if (hover || onClick) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { if (hover || onClick) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, change, positive = true, icon, color = 'var(--accent-blue)' }: StatCardProps) {
  return (
    <Card hover style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${color}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
          {change && (
            <p style={{ fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: positive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              <span>{positive ? '↑' : '↓'}</span>{change}
            </p>
          )}
        </div>
        <div style={{ padding: '12px', borderRadius: '12px', background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
