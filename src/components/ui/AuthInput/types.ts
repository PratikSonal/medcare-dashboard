import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  label: string;
  icon: LucideIcon;
  headerRight?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}
