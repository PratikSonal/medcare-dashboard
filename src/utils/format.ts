export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCompact = (n: number): string =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
