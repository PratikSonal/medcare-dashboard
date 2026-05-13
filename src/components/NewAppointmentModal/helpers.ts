import type { Appointment } from "@/features/appointments/types";
import type { Patient } from "@/features/patients/types";
import type { ConflictInfo, FormState } from "./types";
import { TSTART, TDUR } from "./constants";

export const t2m = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const toLeft = (min: number): string => `${(((min - TSTART) / TDUR) * 100).toFixed(2)}%`;

export const toWidth = (dur: number): string => `${((dur / TDUR) * 100).toFixed(2)}%`;

export const minToTime = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const getConflict = (
  slot: string,
  duration: number,
  docBusy: Appointment[],
  patBusy: Appointment[],
): ConflictInfo => {
  const s = t2m(slot);
  const e = s + duration;
  return {
    doctor: docBusy.find(a => {
      const as2 = t2m(a.time);
      return s < as2 + a.duration && e > as2;
    }),
    patient: patBusy.find(a => {
      const as2 = t2m(a.time);
      return s < as2 + a.duration && e > as2;
    }),
  };
};

export const validateForm = (form: FormState): Partial<Record<keyof FormState, boolean>> => {
  const errs: Partial<Record<keyof FormState, boolean>> = {};
  if (!form.patientId) errs.patientId = true;
  if (!form.doctor) errs.doctor = true;
  if (!form.time) errs.time = true;
  return errs;
};

export const buildAppointment = (
  form: FormState,
  patients: Patient[],
  appointments: Appointment[],
): Appointment => {
  const pt = patients.find(p => p.id === form.patientId)!;
  const existingDoc = appointments.find(a => a.doctor === form.doctor);
  const existingPat = appointments.find(a => a.patientId === form.patientId);

  return {
    id: `A${Date.now()}`,
    patientId: pt.id,
    patientName: pt.name,
    patientAvatar: pt.avatar,
    dob: `01 Jan ${new Date().getFullYear() - pt.age}`,
    phone: pt.phone,
    doctor: form.doctor,
    department: pt.department,
    clinicName: existingDoc?.clinicName ?? form.doctor,
    date: form.date,
    time: form.time,
    duration: form.duration,
    status: "Pending",
    type: form.type,
    notes: form.notes || undefined,
    intakeComplete: false,
    insuranceVerified: false,
    insuranceProvider: existingPat?.insuranceProvider ?? "General Insurance",
  };
};
