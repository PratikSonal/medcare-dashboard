import type { Variants } from 'framer-motion';

export const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
export const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const ttStyle = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-primary)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontFamily: 'Poppins',
    fontSize: '12px',
  },
};

export const RADIAN = Math.PI / 180;
export const PROC_COLORS = ['#3c83f6', '#7c3bed', '#0ea5e9', '#f59e0b', '#6366f1'];
