export const CLAIM_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Approved: { color: "var(--accent-cyan)", bg: "var(--accent-cyan-subtle)" },
  Partial: { color: "var(--accent-purple)", bg: "var(--accent-purple-subtle)" },
  Pending: { color: "var(--accent-yellow)", bg: "var(--accent-yellow-subtle)" },
  Denied: { color: "var(--accent-red)", bg: "var(--accent-red-subtle)" },
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
