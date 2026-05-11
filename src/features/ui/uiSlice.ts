import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Notification } from '@/types';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
}

const savedTheme = (localStorage.getItem('medcare-theme') as Theme) || 'light';

const initialState: UIState = {
  theme: savedTheme,
  sidebarOpen: true,
  notifications: [
    { id: 'N001', title: 'Critical Alert', message: 'Patient Rohan Verma requires immediate attention in ICU.', type: 'error', timestamp: new Date().toISOString(), read: false },
    { id: 'N002', title: 'New Admission', message: 'Lakshmi Naidu admitted to Neurology department.', type: 'info', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
    { id: 'N003', title: 'Lab Results Ready', message: 'Blood panel results for Sanya Kapoor are available.', type: 'success', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: 'N004', title: 'Appointment Reminder', message: 'Dr. Sneha Iyer has 3 appointments in 30 minutes.', type: 'warning', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
  ],
  unreadCount: 2,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('medcare-theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem('medcare-theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) {
      const newNotif: Notification = {
        ...action.payload,
        id: `N${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(newNotif);
      state.unreadCount += 1;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, markNotificationRead, markAllRead, addNotification } = uiSlice.actions;
export default uiSlice.reducer;
