export const PATIENT_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Active: { color: "var(--accent-cyan)", bg: "rgba(14, 165, 233, 0.1)" },
  Critical: { color: "var(--accent-red)", bg: "rgba(239, 68, 68, 0.1)" },
  Recovering: { color: "var(--accent-yellow)", bg: "rgba(245, 158, 11, 0.1)" },
  Discharged: { color: "var(--text-tertiary)", bg: "rgba(107, 114, 128, 0.1)" },
};

export const getStatusColor = (status: string): string =>
  PATIENT_STATUS_COLORS[status]?.color ?? "var(--text-tertiary)";

export const getStatusBg = (status: string): string =>
  PATIENT_STATUS_COLORS[status]?.bg ?? "rgba(107, 114, 128, 0.1)";
