export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "var(--accent-cyan)";
    case "Critical":
      return "var(--accent-red)";
    case "Recovering":
      return "var(--accent-yellow)";
    case "Discharged":
      return "var(--text-tertiary)";
    default:
      return "var(--text-tertiary)";
  }
};

export const getStatusBg = (status: string): string => {
  switch (status) {
    case "Active":
      return "rgba(14, 165, 233, 0.1)";
    case "Critical":
      return "rgba(239, 68, 68, 0.1)";
    case "Recovering":
      return "rgba(245, 158, 11, 0.1)";
    case "Discharged":
      return "rgba(107, 114, 128, 0.1)";
    default:
      return "rgba(107, 114, 128, 0.1)";
  }
};
