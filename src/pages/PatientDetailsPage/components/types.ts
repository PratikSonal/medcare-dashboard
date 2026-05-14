import type { Patient } from "@/features/patients/types";

export interface PatientCardProps {
  patient: Patient;
  onPatientClick: (patient: Patient) => void;
}

export interface PatientListRowProps {
  patient: Patient;
  onPatientClick: (patient: Patient) => void;
}

export interface PatientGridProps {
  filteredPatients: Patient[];
  onPatientClick: (patient: Patient) => void;
}

export interface PatientListViewProps {
  filteredPatients: Patient[];
  onPatientClick: (patient: Patient) => void;
}
