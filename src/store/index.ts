import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import patientsReducer from "@/features/patients/patientsSlice";
import uiReducer from "@/features/ui/uiSlice";
import appointmentsReducer from "@/features/appointments/appointmentsSlice";
import billingReducer from "@/features/billing/billingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    ui: uiReducer,
    appointments: appointmentsReducer,
    billing: billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
