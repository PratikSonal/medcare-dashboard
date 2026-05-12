import type { Variants } from 'framer-motion';
import type { AppointmentStatus } from '@/types';

export const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
export const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export const ALL_STATUSES: AppointmentStatus[] = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'No-Show'];
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
