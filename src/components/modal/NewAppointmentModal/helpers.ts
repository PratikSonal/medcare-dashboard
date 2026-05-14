import { getYear } from "date-fns";

import type { Appointment } from "@/features/appointments/types";
import type { Patient } from "@/features/patients/types";
import { cn } from "@/utils";
import { minToTime, t2m } from "@/utils/time";

import { TDUR, TSTART } from "./constants";
import type { ConflictInfo, NewAppointmentFormData } from "./types";
export { minToTime, t2m };

export const getFieldCls = (hasError: boolean): string =>
  cn(
    "w-full bg-bg-tertiary rounded-[10px] py-[10px] px-3 text-[13px] text-text-primary outline-none font-sans box-border transition-colors duration-150 focus:border-accent-blue",
    hasError ? "border border-accent-red" : "border border-border-primary",
  );

export const toLeft = (min: number): string => `${(((min - TSTART) / TDUR) * 100).toFixed(2)}%`;

export const toWidth = (dur: number): string => `${((dur / TDUR) * 100).toFixed(2)}%`;

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

export const buildAppointment = (
  form: NewAppointmentFormData,
  patients: Patient[],
  appointments: Appointment[],
): Appointment => {
  const pt = patients.find(p => p.id === form.patientId);
  if (!pt) throw new Error(`buildAppointment: patient "${form.patientId}" not found`);
  const existingDoc = appointments.find(a => a.doctor === form.doctor);
  const existingPat = appointments.find(a => a.patientId === form.patientId);

  return {
    id: crypto.randomUUID(),
    patientId: pt.id,
    patientName: pt.name,
    patientAvatar: pt.avatar,
    dob: `01 Jan ${getYear(new Date()) - pt.age}`,
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
