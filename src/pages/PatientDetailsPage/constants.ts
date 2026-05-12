import type { Variants } from 'framer-motion';

export const DEPARTMENTS = [
  'All', 'Cardiology', 'Neurology', 'Pulmonology', 'Endocrinology',
  'Orthopedics', 'Surgery', 'Nephrology', 'Internal Medicine',
  'Gastroenterology', 'Rheumatology',
];

export const STATUSES = ['All', 'Active', 'Critical', 'Recovering', 'Discharged'];

export const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
export const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
