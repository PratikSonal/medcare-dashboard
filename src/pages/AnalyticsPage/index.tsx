import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setFilterStatus, clearFilters } from "@/features/patients/patientsSlice";
import type { RootState } from "@/store";
import { container, item } from "./constants";
import { ChartsRow } from "./components/ChartsRow";
import { TrendsRow } from "./components/TrendsRow";
import { FinancialBreakdown } from "./components/FinancialBreakdown";
import { DoctorPerformance } from "./components/DoctorPerformance";

const AnalyticsPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const metrics = useAppSelector((s: RootState) => s.analytics.metrics);

  const { totalPatients, totalRevenue, totalAppointments, totalRecovered, recoveryRate } = useMemo(
    () => {
      const totalPatients = metrics.reduce((sum, d) => sum + d.patients, 0);
      const totalRevenue = metrics.reduce((sum, d) => sum + d.revenue, 0);
      const totalAppointments = metrics.reduce((sum, d) => sum + d.appointments, 0);
      const totalRecovered = metrics.reduce((sum, d) => sum + d.recovered, 0);
      return {
        totalPatients,
        totalRevenue,
        totalAppointments,
        totalRecovered,
        recoveryRate: Math.round((totalRecovered / totalPatients) * 100),
      };
    },
    [metrics],
  );

  const kpis = useMemo(
    () => [
      {
        title: "Total Patients",
        rawValue: totalPatients,
        sub: "7-month period",
        icon: <Users size={20} />,
        color: "var(--accent-blue)",
        onClick: () => { dispatch(clearFilters()); navigate("/patients"); },
      },
      {
        title: "Total Revenue",
        rawValue: Math.round(totalRevenue / 10000),
        format: (n: number): string => `₹${(n / 10).toFixed(1)}L`,
        icon: <DollarSign size={20} />,
        color: "var(--accent-cyan)",
        sub: "Nov 2025 – May 2026",
        onClick: () => navigate("/billing"),
      },
      {
        title: "Appointments",
        rawValue: totalAppointments,
        sub: "All scheduled visits",
        icon: <Activity size={20} />,
        color: "var(--accent-purple)",
        onClick: () => navigate("/appointments"),
      },
      {
        title: "Recovery Rate",
        rawValue: recoveryRate,
        suffix: "%",
        sub: `${totalRecovered.toLocaleString()} patients recovered`,
        icon: <TrendingUp size={20} />,
        color: "var(--accent-yellow)",
        onClick: () => { dispatch(setFilterStatus("Discharged")); navigate("/patients"); },
      },
    ],
    [totalPatients, totalRevenue, totalAppointments, totalRecovered, recoveryRate, navigate, dispatch],
  );

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
            <h1 className="text-[30px] font-bold text-text-primary">Analytics</h1>
            <p className="text-sm text-text-secondary mt-1">
              Performance insights and health metrics
            </p>
          </div>
          <Badge variant="info">Nov 2025 — May 2026</Badge>
        </div>
        <div className="glow-line mt-6" />
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8"
      >
        {kpis.map(kpi => (
          <KpiCard key={kpi.title} {...kpi} showArrow />
        ))}
      </motion.div>

      <ChartsRow />
      <TrendsRow />
      <FinancialBreakdown />
      <DoctorPerformance />
    </motion.div>
  );
};

export default AnalyticsPage;
