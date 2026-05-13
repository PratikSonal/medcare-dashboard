import type { Appointment } from "@/features/appointments/types";

export interface ActionRequiredProps {
  todayAll: Appointment[];
}

export interface AppointmentDetailModalProps {
  app: Appointment | null;
  onClose: () => void;
}

export interface AppointmentListProps {
  todayApps: Appointment[];
  dateKey: string;
  filterStatus: string;
  onSelectApp: (app: Appointment) => void;
}

export interface DoctorSchedulesProps {
  doctors: string[];
  todayAll: Appointment[];
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: string;
  onFilterStatus: (s: string) => void;
  filterType: string;
  onFilterType: (t: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export interface TimeSlotsProps {
  todayAll: Appointment[];
}

export interface WeekStripProps {
  weekDays: Date[];
  baseDate: Date;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}
