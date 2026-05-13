export type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled" | "No-Show";
export type AppointmentType =
  | "New Patient"
  | "Follow-up"
  | "Emergency"
  | "Routine Check"
  | "Consultation"
  | "Dialysis Review"
  | "Insulin Review";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  dob: string;
  phone: string;
  doctor: string;
  department: string;
  clinicName: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  intakeComplete: boolean;
  insuranceVerified: boolean;
  insuranceProvider: string;
}
