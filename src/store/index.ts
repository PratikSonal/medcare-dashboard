import { configureStore } from "@reduxjs/toolkit";

import analyticsReducer from "@/features/analytics/analyticsSlice";
import appointmentsReducer from "@/features/appointments/appointmentsSlice";
import authReducer from "@/features/auth/authSlice";
import billingReducer from "@/features/billing/billingSlice";
import patientsReducer from "@/features/patients/patientsSlice";
import uiReducer from "@/features/ui/uiSlice";

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
