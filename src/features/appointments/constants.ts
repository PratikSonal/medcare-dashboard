export const APPT_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Confirmed: { color: "var(--accent-blue)", bg: "var(--accent-blue-subtle)" },
  Pending: { color: "var(--accent-yellow)", bg: "var(--accent-yellow-subtle)" },
  Completed: { color: "var(--accent-cyan)", bg: "var(--accent-cyan-subtle)" },
  Cancelled: { color: "var(--text-tertiary)", bg: "rgba(107,114,128,0.1)" },
  "No-Show": { color: "var(--accent-red)", bg: "var(--accent-red-subtle)" },
};

export const APPT_TYPE_COLORS: Record<string, string> = {
  Emergency: "var(--accent-red)",
  "New Patient": "var(--accent-purple)",
  "Follow-up": "var(--accent-blue)",
  "Routine Check": "var(--accent-cyan)",
  Consultation: "var(--accent-yellow)",
  "Dialysis Review": "var(--chart-sky)",
  "Insulin Review": "var(--accent-cyan)",
};
