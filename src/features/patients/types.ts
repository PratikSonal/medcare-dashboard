export type PatientStatus = "Active" | "Critical" | "Recovering" | "Discharged";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

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
  gender: "Male" | "Female" | "Other";
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

export type PrescriptionStatus = "Active" | "Completed" | "Discontinued";

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
