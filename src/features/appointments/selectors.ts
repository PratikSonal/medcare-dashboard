import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

const selectAppointments = (s: RootState) => s.appointments.appointments;

export const selectDoctorRoster = createSelector(selectAppointments, appointments =>
  [...new Set(appointments.map(a => a.doctor))].sort(),
);

export const selectAppointmentsByDate = (dateKey: string) =>
  createSelector(selectAppointments, appointments =>
    appointments
      .filter(a => a.date === dateKey)
      .sort((a, b) => a.time.localeCompare(b.time)),
  );

export const selectAppointmentCountByStatus = createSelector(
  selectAppointments,
  appointments => ({
    Confirmed: appointments.filter(a => a.status === "Confirmed").length,
    Pending: appointments.filter(a => a.status === "Pending").length,
    Completed: appointments.filter(a => a.status === "Completed").length,
    Cancelled: appointments.filter(a => a.status === "Cancelled").length,
    "No-Show": appointments.filter(a => a.status === "No-Show").length,
  }),
);

export const selectActionRequired = createSelector(selectAppointments, appointments =>
  appointments.filter(a => !a.intakeComplete || !a.insuranceVerified),
);
