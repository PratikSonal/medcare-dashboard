export const CLAIM_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Approved: { color: "var(--accent-cyan)", bg: "rgba(14,165,233,0.1)" },
  Partial: { color: "var(--accent-purple)", bg: "rgba(124,59,237,0.1)" },
  Pending: { color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.1)" },
  Denied: { color: "var(--accent-red)", bg: "rgba(239,68,68,0.1)" },
};

export const PROVIDER_SHORT: Record<string, string> = {
  "Star Health Insurance": "Star Health",
  "HDFC ERGO Health": "HDFC ERGO",
  "Bajaj Allianz Health": "Bajaj Allianz",
  "Niva Bupa Health": "Niva Bupa",
  "New India Assurance": "New India",
  "ICICI Lombard Health": "ICICI Lombard",
  "United India Insurance": "United India",
};
