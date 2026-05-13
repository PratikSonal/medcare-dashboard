import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "#0ea5e9";
    case "Critical":
      return "var(--accent-red)";
    case "Recovering":
      return "var(--accent-yellow)";
    case "Discharged":
      return "var(--text-tertiary)";
    default:
      return "var(--text-tertiary)";
  }
}

export function getStatusBg(status: string): string {
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
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const formatCompact = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

export const PROVIDER_SHORT: Record<string, string> = {
  "Star Health Insurance": "Star Health",
  "HDFC ERGO Health": "HDFC ERGO",
  "Bajaj Allianz Health": "Bajaj Allianz",
  "Niva Bupa Health": "Niva Bupa",
  "New India Assurance": "New India",
  "ICICI Lombard Health": "ICICI Lombard",
  "United India Insurance": "United India",
};
