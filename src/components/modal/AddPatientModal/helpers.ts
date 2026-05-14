import type { Patient } from "@/features/patients/types";
import type { AddPatientFormData } from "@/lib/validators";
import { cn } from "@/utils";

export const getInputCls = (hasError: boolean): string =>
  cn(
    "w-full bg-bg-secondary rounded-[10px] py-[9px] px-3 text-[13px] text-text-primary outline-none font-sans box-border transition-colors duration-150 focus:border-accent-blue",
    hasError ? "border border-accent-red" : "border border-border-primary",
  );

export const buildPatient = (form: AddPatientFormData, nextId: string): Patient => {
  const initials = form.name
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id: nextId,
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
  const ids = patients.map(p => parseInt(p.id.slice(1), 10)).filter(n => !isNaN(n) && isFinite(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `P${String(maxId + 1).padStart(3, "0")}`;
};
