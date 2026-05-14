import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string): string =>
  format(parseISO(dateString), "dd MMM yyyy");

export const formatCompact = (n: number): string =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
