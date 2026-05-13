import type { PatientStatus, BloodGroup } from "@/features/patients/types";

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
