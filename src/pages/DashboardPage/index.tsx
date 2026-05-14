import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  CreditCard,
  UserCheck,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { mockBillingData } from "@/data/billing";
import { showDailySummaryNotification } from "@/services/notifications";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setFilterStatus, clearFilters } from "@/features/patients/patientsSlice";
import { formatDate } from "@/utils";
import type { RootState } from "@/store";
import type { Patient } from "@/features/patients/types";
import type { Appointment } from "@/features/appointments/types";
import { container, item, TODAY_DATE } from "./constants";
import { CriticalBanner } from "./components/CriticalBanner";
import { TrendsRow } from "./components/TrendsRow";
import { AppointmentsTable } from "./components/AppointmentsTable";

const DashboardPage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const patients = useAppSelector((s: RootState) => s.patients.patients);
  const appointments = useAppSelector((s: RootState) => s.appointments.appointments);

  const criticalCount = useMemo(
    () => patients.filter((p: Patient) => p.status === "Critical").length,
    [patients],
  );
  const activeCount = useMemo(
    () => patients.filter((p: Patient) => p.status === "Active").length,
    [patients],
  );
  const dischargedCount = useMemo(
    () => patients.filter((p: Patient) => p.status === "Discharged").length,
    [patients],
  );
  const recoveringCount = useMemo(
    () => patients.filter((p: Patient) => p.status === "Recovering").length,
    [patients],
  );
  const departmentCount = useMemo(
    () => new Set(patients.map((p: Patient) => p.department)).size,
    [patients],
  );
  const doctorCount = useMemo(
    () => new Set(patients.map((p: Patient) => p.doctor)).size,
    [patients],
  );
  const todayAppointments = useMemo(
    () => appointments.filter((a: Appointment) => a.date === TODAY_DATE),
    [appointments],
  );

  const { totalBilled, pendingClaims, approvalRate } = useMemo(() => ({
    totalBilled: mockBillingData.reduce((sum, record) => sum + record.totalAmount, 0),
    pendingClaims: mockBillingData.filter(record => record.claimStatus === "Pending").length,
    approvalRate: Math.round(
      (mockBillingData.filter(record => record.claimStatus === "Approved").length / mockBillingData.length) * 100,
    ),
  }), []);

  const kpis = useMemo(
    () => [
      {
        title: "Total Patients",
        rawValue: patients.length,
        change: "12% this month",
        positive: true,
        icon: <Users size={20} />,
        color: "var(--accent-blue)",
        onClick: () => { dispatch(clearFilters()); navigate("/patients"); },
      },
      {
        title: "Active Cases",
        rawValue: activeCount,
        change: "8% this week",
        positive: true,
        icon: <Activity size={20} />,
        color: "var(--accent-cyan)",
        onClick: () => { dispatch(setFilterStatus("Active")); navigate("/patients"); },
      },
      {
        title: "Critical Alerts",
        rawValue: criticalCount,
        change: "2 new today",
        positive: false,
        icon: <AlertTriangle size={20} />,
        color: "var(--accent-red)",
        onClick: () => { dispatch(setFilterStatus("Critical")); navigate("/patients"); },
      },
      {
        title: "Appointments Today",
        rawValue: todayAppointments.length,
        change: "vs 6 yesterday",
        positive: true,
        icon: <Calendar size={20} />,
        color: "var(--accent-purple)",
        onClick: () => navigate("/appointments"),
      },
      {
        title: "Revenue Billed",
        value: `₹${(totalBilled / 100000).toFixed(1)}L`,
        sub: `${pendingClaims} claims pending`,
        icon: <CreditCard size={20} />,
        color: "var(--accent-yellow)",
        onClick: () => navigate("/billing"),
      },
    ],
    [patients.length, activeCount, criticalCount, todayAppointments.length, totalBilled, pendingClaims, navigate, dispatch],
  );

  const quickStats = useMemo(
    () => [
      {
        title: "Discharged",
        rawValue: dischargedCount,
        sub: "Patients released",
        icon: <UserCheck size={20} />,
        color: "var(--text-tertiary)",
        onClick: () => { dispatch(setFilterStatus("Discharged")); navigate("/patients"); },
      },
      {
        title: "Recovering",
        rawValue: recoveringCount,
        sub: "In recovery phase",
        icon: <Activity size={20} />,
        color: "var(--accent-yellow)",
        onClick: () => { dispatch(setFilterStatus("Recovering")); navigate("/patients"); },
      },
      {
        title: "Departments",
        rawValue: departmentCount,
        sub: "Active specialties",
        icon: <Building2 size={20} />,
        color: "var(--accent-purple)",
      },
      {
        title: "Doctors",
        rawValue: doctorCount,
        sub: "Attending physicians",
        icon: <Users size={20} />,
        color: "var(--accent-blue)",
      },
      {
        title: "Claim Approval",
        rawValue: approvalRate,
        suffix: "%",
        sub: "Insurance approved",
        icon: <ShieldCheck size={20} />,
        color: "var(--accent-cyan)",
      },
    ],
    [dischargedCount, recoveringCount, departmentCount, doctorCount, approvalRate, navigate, dispatch],
  );

  useEffect(() => {
    const t = setTimeout(
      () => showDailySummaryNotification(patients.length, criticalCount),
      5000,
    );
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1280px] mx-auto"
    >
      <motion.div variants={item} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              Overview of patients, appointments, and revenue
            </p>
          </div>
          <Badge variant="info">{formatDate(TODAY_DATE)}</Badge>
        </div>
        <div className="glow-line mt-6" />
      </motion.div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
        {kpis.map(kpi => (
          <KpiCard key={kpi.title} variants={item} {...kpi} />
        ))}
      </div>

      <CriticalBanner />
      <TrendsRow />

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {quickStats.map(stat => (
          <KpiCard key={stat.title} size="sm" {...stat} />
        ))}
      </motion.div>

      <AppointmentsTable />
    </motion.div>
  );
};

export default DashboardPage;
