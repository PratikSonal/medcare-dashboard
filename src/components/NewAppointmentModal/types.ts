import type { AppointmentType, Appointment } from '@/types';

export interface Props {
  defaultDate: string;
  onClose: () => void;
}

export interface ConflictInfo {
  doctor?: Appointment;
  patient?: Appointment;
}

export interface FormState {
  patientId: string;
  doctor: string;
  date: string;
  type: AppointmentType;
  duration: number;
  time: string;
  notes: string;
}
