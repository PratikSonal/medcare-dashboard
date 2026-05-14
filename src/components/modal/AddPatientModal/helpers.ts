import { cn } from "@/utils";
import type { Patient } from "@/features/patients/types";
import type { FormData } from "./types";

export const getInputCls = (
  field: keyof FormData,
  errors: Partial<Record<keyof FormData, boolean>>,
): string =>
  cn(
    "w-full bg-bg-secondary rounded-[10px] py-[9px] px-3 text-[13px] text-text-primary outline-none font-sans box-border transition-colors duration-150 focus:border-accent-blue",
    errors[field] ? "border border-accent-red" : "border border-border-primary",
  );

export const validateStep = (
  step: number,
  form: FormData,
): Partial<Record<keyof FormData, boolean>> => {
  const e: Partial<Record<keyof FormData, boolean>> = {};

  if (step === 0) {
    if (!form.name.trim()) e.name = true;
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120)
      e.age = true;
    if (!form.phone.trim()) e.phone = true;
  } else if (step === 1) {
    if (!form.diagnosis.trim()) e.diagnosis = true;
  } else {
    if (!form.heartRate || isNaN(Number(form.heartRate))) e.heartRate = true;
    if (!form.bloodPressure.trim()) e.bloodPressure = true;
    if (!form.temperature || isNaN(Number(form.temperature))) e.temperature = true;
    if (!form.oxygenSat || isNaN(Number(form.oxygenSat))) e.oxygenSat = true;
    if (!form.weight || isNaN(Number(form.weight))) e.weight = true;
  }

  return e;
};

export const buildPatient = (form: FormData, maxId: number): Patient => {
  const newId = `P${String(maxId + 1).padStart(3, "0")}`;
  const initials = form.name
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id: newId,
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender,
    bloodGroup: form.bloodGroup,
    status: form.status,
    diagnosis: form.diagnosis.trim(),
    department: form.department,
    doctor: form.doctor,
    admissionDate: form.admissionDate,
    lastVisit: form.admissionDate,
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    avatar: initials,
    vitals: {
      heartRate: Number(form.heartRate),
      bloodPressure: form.bloodPressure.trim(),
      temperature: Number(form.temperature),
      oxygenSat: Number(form.oxygenSat),
      weight: Number(form.weight),
    },
    tags: form.tags
      ? form.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean)
      : [],
  };
};

export const getNextId = (patients: { id: string }[]): string => {
  const maxId = Math.max(...patients.map(p => parseInt(p.id.slice(1), 10)));
  return `P${String(maxId + 1).padStart(3, "0")}`;
};
