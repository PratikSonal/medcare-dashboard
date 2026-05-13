import type { Patient } from "@/features/patients/types";

export type TabId = "overview" | "appointments" | "billing" | "prescriptions";

export interface VitalBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  alert?: boolean;
}

export interface Props {
  patient: Patient;
  onClose: () => void;
}
