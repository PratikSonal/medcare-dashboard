import type { Patient } from "@/features/patients/types";

export interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export interface PatientListRowProps {
  patient: Patient;
  onClick: () => void;
}

export interface PatientGridProps {
  filteredPatients: Patient[];
  onPatientClick: (patient: Patient) => void;
}

export interface PatientListViewProps {
  filteredPatients: Patient[];
  onPatientClick: (patient: Patient) => void;
}
