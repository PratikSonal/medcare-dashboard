import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import patientsReducer from "@/features/patients/patientsSlice";
import uiReducer from "@/features/ui/uiSlice";
import appointmentsReducer from "@/features/appointments/appointmentsSlice";
import billingReducer from "@/features/billing/billingSlice";
import analyticsReducer from "@/features/analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    ui: uiReducer,
    appointments: appointmentsReducer,
    billing: billingReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
