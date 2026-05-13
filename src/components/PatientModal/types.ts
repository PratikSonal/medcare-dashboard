import type { Patient } from "@/features/patients/types";

export type TabId = "overview" | "appointments" | "billing" | "prescriptions";

export interface Props {
  patient: Patient;
  onClose: () => void;
}
