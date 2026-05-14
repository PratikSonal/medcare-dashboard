import { CheckCircle, XCircle, Info } from "lucide-react";
import type { ToastType } from "./types";

export const CONFIG: Record<ToastType, { icon: typeof CheckCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: "var(--accent-green)", bg: "var(--accent-green-subtle)" },
  error: { icon: XCircle, color: "var(--accent-red)", bg: "var(--accent-red-subtle)" },
  info: { icon: Info, color: "var(--accent-blue)", bg: "var(--accent-blue-subtle)" },
};
