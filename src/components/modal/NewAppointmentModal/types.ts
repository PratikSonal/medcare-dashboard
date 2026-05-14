import type { AppointmentType, Appointment } from "@/features/appointments/types";

export interface Props {
  defaultDate: string;
  onClose: () => void;
}

export interface TrackRowProps {
  label: string;
  busy: Appointment[];
  color: string;
  colorRgb: string;
  formTime: string;
  duration: number;
  hasConflict: boolean;
  onTimelineClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onBlockHover: (block: { x: number; y: number; text: string } | null) => void;
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
