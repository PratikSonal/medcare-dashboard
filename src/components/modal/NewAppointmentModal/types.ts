import type { Appointment } from "@/features/appointments/types";
import type { NewAppointmentFormData } from "@/lib/validators";

export type { NewAppointmentFormData };
export type FormState = NewAppointmentFormData;

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
