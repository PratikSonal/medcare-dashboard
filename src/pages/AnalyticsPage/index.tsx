import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { metricsData } from "@/data/analytics";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setFilterStatus, clearFilters } from "@/features/patients/patientsSlice";
import { container, item } from "./constants";
import { ChartsRow } from "./components/ChartsRow";
import { TrendsRow } from "./components/TrendsRow";
import { FinancialBreakdown } from "./components/FinancialBreakdown";
import { DoctorPerformance } from "./components/DoctorPerformance";

const totalPatients = metricsData.reduce((s, d) => s + d.patients, 0);
const totalRevenue = metricsData.reduce((s, d) => s + d.revenue, 0);
const totalAppointments = metricsData.reduce((s, d) => s + d.appointments, 0);
const totalRecovered = metricsData.reduce((s, d) => s + d.recovered, 0);
const recoveryRate = Math.round((totalRecovered / totalPatients) * 100);

const AnalyticsPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const kpis = [
    {
      title: "Total Patients",
      rawValue: totalPatients,
      sub: "7-month period",
      icon: <Users size={20} />,
      color: "var(--accent-blue)",
      onClick: () => {
        dispatch(clearFilters());
        navigate("/patients");
      },
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
      onClick: () => {
        dispatch(setFilterStatus("Discharged"));
        navigate("/patients");
      },
    },
  ];

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
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {kpis.map(k => (
          <KpiCard
            key={k.title}
            rawValue={k.rawValue}
            format={k.format}
            suffix={k.suffix}
            sub={k.sub}
            icon={k.icon}
            color={k.color}
            onClick={k.onClick}
            title={k.title}
            showArrow
          />
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
