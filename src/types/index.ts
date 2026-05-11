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
