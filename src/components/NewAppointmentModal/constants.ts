import type { AppointmentType } from '@/types';

export const TSTART = 9 * 60;
export const TEND = 18 * 60;
export const TDUR = TEND - TSTART;

export const SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export const TYPES: AppointmentType[] = [
  'New Patient', 'Follow-up', 'Emergency', 'Routine Check',
  'Consultation', 'Dialysis Review', 'Insulin Review',
];

export const DURATIONS = [15, 30, 45, 60];

export const TIMELINE_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const TIMELINE_LEGEND = [
  { bg: 'rgba(239,68,68,0.35)',  border: '#ef4444', label: 'Doctor busy' },
  { bg: 'rgba(124,59,237,0.35)', border: '#7c3bed', label: 'Patient busy' },
  { bg: 'rgba(60,131,246,0.5)',  border: '#3c83f6', label: 'Your slot' },
];
