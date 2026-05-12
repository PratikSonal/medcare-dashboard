import type { Variants } from "framer-motion";

export const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
export const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const ttStyle = {
  contentStyle: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-primary)",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontFamily: "Poppins",
    fontSize: "12px",
  },
  labelStyle: { color: "var(--text-primary)", fontFamily: "Poppins" },
  itemStyle: { color: "var(--text-secondary)", fontFamily: "Poppins" },
};

export const RADIAN = Math.PI / 180;
export const PROC_COLORS = [
  "#3c83f6",
  "#7c3bed",
  "#0ea5e9",
  "#f59e0b",
  "#6366f1",
];

export const STATUS_CELLS: {
  key: "active" | "critical" | "recovering" | "discharged";
  bg: string;
  color: string;
}[] = [
  { key: "active", bg: "rgba(14,165,233,0.1)", color: "#0ea5e9" },
  { key: "critical", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  { key: "recovering", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  {
    key: "discharged",
    bg: "rgba(107,114,128,0.1)",
    color: "var(--text-tertiary)",
  },
];
