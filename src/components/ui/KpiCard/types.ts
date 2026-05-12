import type { Variants } from 'framer-motion';

export interface KpiCardProps {
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
