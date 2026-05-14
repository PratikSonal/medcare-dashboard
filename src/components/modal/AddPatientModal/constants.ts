import { User, Stethoscope, Activity } from "lucide-react";
import { PATIENT_STATUS_COLORS } from "@/features/patients/utils";
import type { PatientStatus, BloodGroup } from "@/features/patients/types";
import type { FormData } from "./types";

export const DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Pulmonology",
  "Endocrinology",
  "Orthopedics",
  "Surgery",
  "Nephrology",
  "Internal Medicine",
  "Gastroenterology",
  "Rheumatology",
];

export const DOCTORS = [
  "Dr. Priya Sharma",
  "Dr. Arjun Nair",
  "Dr. Sneha Iyer",
  "Dr. Vikram Rao",
  "Dr. Rahul Gupta",
  "Dr. Meera Pillai",
];

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const STATUSES: PatientStatus[] = ["Active", "Critical", "Recovering", "Discharged"];

export const STATUS_COLORS: Record<PatientStatus, string> = {
  Active: PATIENT_STATUS_COLORS.Active.color,
  Critical: PATIENT_STATUS_COLORS.Critical.color,
  Recovering: PATIENT_STATUS_COLORS.Recovering.color,
  Discharged: PATIENT_STATUS_COLORS.Discharged.color,
};

export const STEPS = [
  { label: "Personal", icon: User },
  { label: "Medical", icon: Stethoscope },
  { label: "Vitals", icon: Activity },
];

export const defaultForm: FormData = {
  name: "",
  age: "",
  gender: "Male",
  bloodGroup: "A+",
  phone: "",
  email: "",
  address: "",
  status: "Active",
  diagnosis: "",
  department: "Cardiology",
  doctor: "Dr. Priya Sharma",
  admissionDate: new Date().toISOString().split("T")[0],
  tags: "",
  heartRate: "",
  bloodPressure: "",
  temperature: "",
  oxygenSat: "",
  weight: "",
};
