export const APPT_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Confirmed: { color: "var(--accent-blue)", bg: "rgba(60,131,246,0.1)" },
  Pending: { color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.1)" },
  Completed: { color: "var(--accent-cyan)", bg: "rgba(14,165,233,0.1)" },
  Cancelled: { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
  "No-Show": { color: "var(--accent-red)", bg: "rgba(239,68,68,0.1)" },
};

export const APPT_TYPE_COLORS: Record<string, string> = {
  Emergency: "var(--accent-red)",
  "New Patient": "var(--accent-purple)",
  "Follow-up": "var(--accent-blue)",
  "Routine Check": "var(--accent-cyan)",
  Consultation: "var(--accent-yellow)",
  "Dialysis Review": "#38bdf8",
  "Insulin Review": "var(--accent-cyan)",
};

export const CLAIM_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Approved: { color: "var(--accent-cyan)", bg: "rgba(14,165,233,0.1)" },
  Partial: { color: "var(--accent-purple)", bg: "rgba(124,59,237,0.1)" },
  Pending: { color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.1)" },
  Denied: { color: "var(--accent-red)", bg: "rgba(239,68,68,0.1)" },
};
