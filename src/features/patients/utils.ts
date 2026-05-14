export const PATIENT_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Active: { color: "var(--accent-cyan)", bg: "var(--accent-cyan-subtle)" },
  Critical: { color: "var(--accent-red)", bg: "var(--accent-red-subtle)" },
  Recovering: { color: "var(--accent-yellow)", bg: "var(--accent-yellow-subtle)" },
  Discharged: { color: "var(--text-tertiary)", bg: "rgba(107, 114, 128, 0.1)" },
};

export const getStatusColor = (status: string): string =>
  PATIENT_STATUS_COLORS[status]?.color ?? "var(--text-tertiary)";

export const getStatusBg = (status: string): string =>
  PATIENT_STATUS_COLORS[status]?.bg ?? "rgba(107,114,128,0.1)";
