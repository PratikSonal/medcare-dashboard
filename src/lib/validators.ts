import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Full name is required"),
});

export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;

const positiveNumStr = (label: string) =>
  z.string().min(1, "Required").refine(v => !isNaN(+v) && +v > 0, `Invalid ${label}`);

export const addPatientSchema = z.object({
  name: z.string().min(1, "Required"),
  age: z.string().min(1, "Required").refine(v => !isNaN(+v) && +v >= 1 && +v <= 120, "Must be 1–120"),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  phone: z.string().min(1, "Required").refine(
    v => v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15,
    "Must be 7–15 digits",
  ),
  email: z.string().refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email"),
  address: z.string(),
  status: z.enum(["Active", "Critical", "Recovering", "Discharged"]),
  diagnosis: z.string().min(1, "Required"),
  department: z.string(),
  doctor: z.string(),
  admissionDate: z.string(),
  tags: z.string(),
  heartRate: positiveNumStr("heart rate"),
  bloodPressure: z.string().min(1, "Required"),
  temperature: positiveNumStr("temperature"),
  oxygenSat: z.string().min(1, "Required").refine(v => !isNaN(+v) && +v >= 0 && +v <= 100, "Must be 0–100"),
  weight: positiveNumStr("weight"),
});

export type AddPatientFormData = z.infer<typeof addPatientSchema>;

export const newAppointmentSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctor: z.string().min(1, "Select a doctor"),
  date: z.string().min(1),
  type: z.enum([
    "New Patient",
    "Follow-up",
    "Emergency",
    "Routine Check",
    "Consultation",
    "Dialysis Review",
    "Insulin Review",
  ]),
  duration: z.number().int().min(15),
  time: z.string().min(1, "Select a time slot"),
  notes: z.string(),
});

export type NewAppointmentFormData = z.infer<typeof newAppointmentSchema>;
