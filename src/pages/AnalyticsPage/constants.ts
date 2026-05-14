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
export const PROC_COLORS = ["var(--accent-blue)", "var(--accent-purple)", "var(--accent-cyan)", "var(--accent-yellow)", "var(--chart-indigo)"];

export const STATUS_CELLS: {
  key: "active" | "critical" | "recovering" | "discharged";
  bg: string;
  color: string;
}[] = [
  { key: "active", bg: "var(--accent-cyan-subtle)", color: "var(--accent-cyan)" },
  { key: "critical", bg: "var(--accent-red-subtle)", color: "var(--accent-red)" },
  { key: "recovering", bg: "var(--accent-yellow-subtle)", color: "var(--accent-yellow)" },
  { key: "discharged", bg: "rgba(107,114,128,0.1)", color: "var(--text-tertiary)" },
];
