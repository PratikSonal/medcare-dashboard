// ── Auth Types ──
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ── Patient Types ──
export type PatientStatus = 'Active' | 'Critical' | 'Recovering' | 'Discharged';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Vital {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSat: number;
  weight: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  status: PatientStatus;
  diagnosis: string;
  department: string;
  doctor: string;
  admissionDate: string;
  lastVisit: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  vitals: Vital;
  tags: string[];
}

// ── Analytics Types ──
export interface MetricDataPoint {
  month: string;
  patients: number;
  revenue: number;
  appointments: number;
  recovered: number;
}

export interface DepartmentStat {
  name: string;
  patients: number;
  color: string;
}

// ── Prescription Types ──
export type PrescriptionStatus = 'Active' | 'Completed' | 'Discontinued';

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  status: PrescriptionStatus;
  refillsLeft?: number;
  notes?: string;
}

// ── Billing Types ──
export type ClaimStatus = 'Approved' | 'Pending' | 'Denied' | 'Partial';

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  visitDate: string;
  department: string;
  procedure: string;
  doctor: string;
  totalAmount: number;
  insuranceProvider: string;
  policyNumber: string;
  claimStatus: ClaimStatus;
  insuranceCovered: number;
  patientDue: number;
}

// ── Appointment Types ──
export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'No-Show';
export type AppointmentType = 'New Patient' | 'Follow-up' | 'Emergency' | 'Routine Check' | 'Consultation' | 'Dialysis Review' | 'Insulin Review';

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

// ── UI Types ──
export type Theme = 'dark' | 'light';
export type ViewMode = 'grid' | 'list';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}
