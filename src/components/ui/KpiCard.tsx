import { motion, type Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

interface KpiCardProps {
  title: string;
  value?: string;
  rawValue?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  sub?: string;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
  showArrow?: boolean;
  active?: boolean;
  size?: 'md' | 'sm';
  variants?: Variants;
}

export function KpiCard({
  title, value, rawValue, prefix = '', suffix = '', format, sub, change, positive = true,
  icon, color = 'var(--accent-blue)', onClick, showArrow, active, size = 'md', variants,
}: KpiCardProps) {
  const count = useCountUp(rawValue ?? 0);
  const displayValue = rawValue !== undefined
    ? (format ? format(count) : `${prefix}${count}${suffix}`)
    : (value ?? '');

  const sm = size === 'sm';

  return (
    <motion.div
      variants={variants}
      className="glass-card"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      style={{
        borderRadius: sm ? '16px' : '20px',
        padding: sm ? '18px' : '24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...(active ? { border: `1px solid ${color}50` } : {}),
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: active ? 0.07 : 0.05,
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
        transition: 'opacity 200ms ease',
      }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: sm ? '12px' : '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: sm ? '10px' : '8px' }}>
            {title}
          </p>
          <p style={{ fontSize: sm ? '28px' : '32px', fontWeight: 700, color: sm ? color : 'var(--text-primary)', lineHeight: 1 }}>
            {displayValue}
          </p>
          {change ? (
            <p style={{ fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: positive ? '#0ea5e9' : 'var(--accent-red)' }}>
              <span>{positive ? '↑' : '↓'}</span>{change}
            </p>
          ) : sub ? (
            <p style={{ fontSize: sm ? '11px' : '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>{sub}</p>
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ padding: sm ? '6px' : '12px', borderRadius: sm ? '8px' : '12px', background: `${color}18`, color, flexShrink: 0 }}>
            {icon}
          </div>
          {showArrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#0ea5e9', fontSize: '11px' }}>
              View <ChevronRight size={12} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
