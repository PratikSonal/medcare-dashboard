import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { AppointmentStatus } from "@/features/appointments/types";
import { APPT_STATUS_COLORS } from "@/features/appointments/constants";

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  Confirmed: {
    ...APPT_STATUS_COLORS.Confirmed,
    icon: <CheckCircle size={13} />,
    label: "Confirmed",
  },
  Pending: { ...APPT_STATUS_COLORS.Pending, icon: <AlertCircle size={13} />, label: "Pending" },
  Completed: {
    ...APPT_STATUS_COLORS.Completed,
    icon: <CheckCircle size={13} />,
    label: "Completed",
  },
  Cancelled: { ...APPT_STATUS_COLORS.Cancelled, icon: <XCircle size={13} />, label: "Cancelled" },
  "No-Show": { ...APPT_STATUS_COLORS["No-Show"], icon: <XCircle size={13} />, label: "No-Show" },
};
