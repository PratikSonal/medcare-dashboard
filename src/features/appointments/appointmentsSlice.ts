import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockAppointments } from "@/lib/mockData";
import type { Appointment, AppointmentStatus } from "./types";

interface AppointmentsState {
  appointments: Appointment[];
}

const initialState: AppointmentsState = {
  appointments: mockAppointments,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload);
    },
    updateAppointmentStatus(
      state,
      action: PayloadAction<{ id: string; status: AppointmentStatus }>,
    ) {
      const appt = state.appointments.find(a => a.id === action.payload.id);
      if (appt) appt.status = action.payload.status;
    },
    updateAppointmentChecks(
      state,
      action: PayloadAction<{ id: string; intakeComplete?: boolean; insuranceVerified?: boolean }>,
    ) {
      const appt = state.appointments.find(a => a.id === action.payload.id);
      if (!appt) return;
      if (action.payload.intakeComplete !== undefined)
        appt.intakeComplete = action.payload.intakeComplete;
      if (action.payload.insuranceVerified !== undefined)
        appt.insuranceVerified = action.payload.insuranceVerified;
    },
  },
});

export const { addAppointment, updateAppointmentStatus, updateAppointmentChecks } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
