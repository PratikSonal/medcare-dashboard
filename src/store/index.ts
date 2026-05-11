import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import patientsReducer from '@/features/patients/patientsSlice';
import uiReducer from '@/features/ui/uiSlice';
import appointmentsReducer from '@/features/appointments/appointmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    ui: uiReducer,
    appointments: appointmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
