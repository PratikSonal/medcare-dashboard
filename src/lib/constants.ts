export const APPT_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Confirmed: { color: '#3c83f6', bg: 'rgba(60,131,246,0.1)' },
  Pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Completed: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  Cancelled: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  'No-Show': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export const APPT_TYPE_COLORS: Record<string, string> = {
  Emergency:      '#ef4444',
  'New Patient':  '#7c3bed',
  'Follow-up':    '#3c83f6',
  'Routine Check':'#0ea5e9',
  Consultation:   '#f59e0b',
  'Dialysis Review': '#38bdf8',
  'Insulin Review':  '#0ea5e9',
};

export const CLAIM_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Approved: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  Partial:  { color: '#7c3bed', bg: 'rgba(124,59,237,0.1)' },
  Pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Denied:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};
