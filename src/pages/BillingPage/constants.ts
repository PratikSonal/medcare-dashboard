import type { Variants } from 'framer-motion';
import type { ClaimStatus } from '@/types';

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
  labelStyle: { color: 'var(--text-primary)', fontFamily: 'Poppins' },
  itemStyle:  { color: 'var(--text-secondary)', fontFamily: 'Poppins' },
};

export const ALL_STATUSES: ClaimStatus[] = ['Approved', 'Partial', 'Pending', 'Denied'];
export const PAGE_SIZE = 10;
