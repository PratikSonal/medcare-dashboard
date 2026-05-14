import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { AddPatientFormData } from "@/lib/validators";

export type { AddPatientFormData };
export type FormData = AddPatientFormData;

export interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export interface AddPatientModalProps {
  onClose: () => void;
}

export interface StepProps {
  register: UseFormRegister<AddPatientFormData>;
  control: Control<AddPatientFormData>;
  errors: FieldErrors<AddPatientFormData>;
}
