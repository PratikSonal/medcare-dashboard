import { BarChart3, Calendar, CreditCard,LayoutDashboard, Users } from "lucide-react";

import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/appointments", icon: Calendar, label: "Appointments" },
  { to: "/billing", icon: CreditCard, label: "Billing" },
];
