import type { BloodGroup,PatientStatus } from "@/features/patients/types";

export interface FieldProps {
  label: string;
  error?: boolean;
  children: React.ReactNode;
}

export interface AddPatientModalProps {
  onClose: () => void;
}

export interface StepProps {
  form: FormData;
  errors: Partial<Record<keyof FormData, boolean>>;
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export type FormData = {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  status: PatientStatus;
  diagnosis: string;
  department: string;
  doctor: string;
  admissionDate: string;
  tags: string;
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenSat: string;
  weight: string;
};
