import { cn } from '@/lib/utils';

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
      className={cn(
        'glass-card rounded-16 p-6 transition-all duration-200',
        (onClick || hover) && 'cursor-pointer hover:-translate-y-0.5',
        className,
      )}
      style={style}
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
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[13px] text-text-secondary mb-2">{title}</p>
          <p className="text-[32px] font-bold text-text-primary leading-none">{value}</p>
          {change && (
            <p className={cn('text-xs mt-2 flex items-center gap-1', positive ? 'text-accent-cyan' : 'text-accent-red')}>
              <span>{positive ? '↑' : '↓'}</span>{change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-12 shrink-0" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
