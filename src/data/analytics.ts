import type { MetricDataPoint, DepartmentStat } from "@/features/analytics/types";

export const metricsData: MetricDataPoint[] = [
  { month: "Nov", patients: 310, revenue: 420000, appointments: 280, recovered: 185 },
  { month: "Dec", patients: 340, revenue: 460000, appointments: 310, recovered: 210 },
  { month: "Jan", patients: 290, revenue: 390000, appointments: 265, recovered: 178 },
  { month: "Feb", patients: 370, revenue: 510000, appointments: 340, recovered: 240 },
  { month: "Mar", patients: 420, revenue: 580000, appointments: 390, recovered: 275 },
  { month: "Apr", patients: 395, revenue: 545000, appointments: 360, recovered: 258 },
  { month: "May", patients: 450, revenue: 620000, appointments: 415, recovered: 298 },
];

export const departmentStats: DepartmentStat[] = [
  { name: "Cardiology", patients: 87, color: "var(--accent-blue)" },
  { name: "Neurology", patients: 64, color: "var(--accent-purple)" },
  { name: "Pulmonology", patients: 58, color: "var(--accent-cyan)" },
  { name: "Endocrinology", patients: 72, color: "var(--accent-yellow)" },
  { name: "Orthopedics", patients: 49, color: "#38bdf8" },
  { name: "Surgery", patients: 55, color: "#6366f1" },
  { name: "Nephrology", patients: 38, color: "#a78bfa" },
  { name: "Others", patients: 27, color: "#6b7280" },
];

export const todayAppointmentCount = 8;
