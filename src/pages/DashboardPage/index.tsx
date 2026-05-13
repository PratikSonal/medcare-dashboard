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
import { mockBillingData } from "@/lib/mockData";
import { showDailySummaryNotification } from "@/lib/notifications";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setFilterStatus, clearFilters } from "@/features/patients/patientsSlice";
import { container, item } from "./constants";
import { CriticalBanner } from "./components/CriticalBanner";
import { TrendsRow } from "./components/TrendsRow";
import { AppointmentsTable } from "./components/AppointmentsTable";

const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
const pendingClaims = mockBillingData.filter(r => r.claimStatus === "Pending").length;
const approvalRate = Math.round(
  (mockBillingData.filter(r => r.claimStatus === "Approved").length / mockBillingData.length) * 100,
);

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const patients = useAppSelector(s => s.patients.patients);
  const appointments = useAppSelector(s => s.appointments.appointments);

  const criticalPatients = useMemo(() => patients.filter(p => p.status === "Critical"), [patients]);
  const activeCount = useMemo(() => patients.filter(p => p.status === "Active").length, [patients]);
  const dischargedCount = useMemo(
    () => patients.filter(p => p.status === "Discharged").length,
    [patients],
  );
  const recoveringCount = useMemo(
    () => patients.filter(p => p.status === "Recovering").length,
    [patients],
  );
  const departmentCount = useMemo(() => new Set(patients.map(p => p.department)).size, [patients]);
  const doctorCount = useMemo(() => new Set(patients.map(p => p.doctor)).size, [patients]);
  const todayAppointments = useMemo(
    () => appointments.filter(a => a.date === "2026-05-11"),
    [appointments],
  );

  const kpis = [
    {
      title: "Total Patients",
      rawValue: patients.length,
      change: "12% this month",
      positive: true,
      icon: <Users size={20} />,
      color: "#3c83f6",
      onClick: () => {
        dispatch(clearFilters());
        navigate("/patients");
      },
    },
    {
      title: "Active Cases",
      rawValue: activeCount,
      change: "8% this week",
      positive: true,
      icon: <Activity size={20} />,
      color: "#0ea5e9",
      onClick: () => {
        dispatch(setFilterStatus("Active"));
        navigate("/patients");
      },
    },
    {
      title: "Critical Alerts",
      rawValue: criticalPatients.length,
      change: "2 new today",
      positive: false,
      icon: <AlertTriangle size={20} />,
      color: "#ef4444",
      onClick: () => {
        dispatch(setFilterStatus("Critical"));
        navigate("/patients");
      },
    },
    {
      title: "Appointments Today",
      rawValue: todayAppointments.length,
      change: "vs 6 yesterday",
      positive: true,
      icon: <Calendar size={20} />,
      color: "#7c3bed",
      onClick: () => navigate("/appointments"),
    },
    {
      title: "Revenue Billed",
      value: `₹${(totalBilled / 100000).toFixed(1)}L`,
      sub: `${pendingClaims} claims pending`,
      icon: <CreditCard size={20} />,
      color: "#f59e0b",
      onClick: () => navigate("/billing"),
    },
  ];

  const quickStats = [
    {
      title: "Discharged",
      rawValue: dischargedCount,
      sub: "Patients released",
      icon: <UserCheck size={20} />,
      color: "#9ca3af",
      onClick: () => {
        dispatch(setFilterStatus("Discharged"));
        navigate("/patients");
      },
    },
    {
      title: "Recovering",
      rawValue: recoveringCount,
      sub: "In recovery phase",
      icon: <Activity size={20} />,
      color: "#f59e0b",
      onClick: () => {
        dispatch(setFilterStatus("Recovering"));
        navigate("/patients");
      },
    },
    {
      title: "Departments",
      rawValue: departmentCount,
      sub: "Active specialties",
      icon: <Building2 size={20} />,
      color: "#7c3bed",
    },
    {
      title: "Doctors",
      rawValue: doctorCount,
      sub: "Attending physicians",
      icon: <Users size={20} />,
      color: "#3c83f6",
    },
    {
      title: "Claim Approval",
      rawValue: approvalRate,
      suffix: "%",
      sub: "Insurance approved",
      icon: <ShieldCheck size={20} />,
      color: "#0ea5e9",
    },
  ];

  useEffect(() => {
    const t = setTimeout(
      () => showDailySummaryNotification(patients.length, criticalPatients.length),
      5000,
    );
    return () => clearTimeout(t);
  }, [patients.length, criticalPatients.length]);

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
          <Badge variant="info">12 May 2026</Badge>
        </div>
        <div className="glow-line mt-6" />
      </motion.div>

      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {kpis.map(k => (
          <KpiCard key={k.title} variants={item} {...k} />
        ))}
      </div>

      <CriticalBanner />
      <TrendsRow />

      <motion.div variants={item} className="grid grid-cols-5 gap-4 mb-6">
        {quickStats.map(s => (
          <KpiCard key={s.title} size="sm" {...s} />
        ))}
      </motion.div>

      <AppointmentsTable />
    </motion.div>
  );
};

export default DashboardPage;
