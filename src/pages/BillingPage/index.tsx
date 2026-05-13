import { useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { formatCompact } from "@/lib/utils";
import { container, item } from "./constants";
import { ChartsRow } from "./components/ChartsRow";
import { BillingTable } from "./components/BillingTable";

const BillingPage = () => {
  const records = useAppSelector(s => s.billing.records);

  const totalBilled = useMemo(() => records.reduce((s, r) => s + r.totalAmount, 0), [records]);
  const insuranceCoveredTotal = useMemo(
    () => records.reduce((s, r) => s + r.insuranceCovered, 0),
    [records],
  );
  const patientDueTotal = useMemo(() => records.reduce((s, r) => s + r.patientDue, 0), [records]);
  const pendingRecords = useMemo(() => records.filter(r => r.claimStatus === "Pending"), [records]);
  const pendingAmount = useMemo(
    () => pendingRecords.reduce((s, r) => s + r.totalAmount, 0),
    [pendingRecords],
  );

  const kpis = [
    {
      title: "Total Billed",
      rawValue: totalBilled,
      format: formatCompact,
      sub: `${records.length} records`,
      icon: <CreditCard size={20} />,
      color: "#3c83f6",
    },
    {
      title: "Insurance Settled",
      rawValue: insuranceCoveredTotal,
      format: formatCompact,
      sub: `${Math.round((insuranceCoveredTotal / totalBilled) * 100)}% of total`,
      icon: <CheckCircle size={20} />,
      color: "#0ea5e9",
    },
    {
      title: "Patient Outstanding",
      rawValue: patientDueTotal,
      format: formatCompact,
      sub: "Across all visits",
      icon: <TrendingUp size={20} />,
      color: "#7c3bed",
    },
    {
      title: "Pending Claims",
      rawValue: pendingRecords.length,
      sub: formatCompact(pendingAmount) + " at risk",
      icon: <Clock size={20} />,
      color: "#f59e0b",
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
            <h1 className="text-[30px] font-bold text-text-primary">Billing & Revenue</h1>
            <p className="text-sm text-text-secondary mt-1">
              Insurance claims, payments, and financial overview
            </p>
          </div>
          <Badge variant="info">May 2026</Badge>
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
            title={k.title}
            rawValue={k.rawValue}
            format={k.format}
            sub={k.sub}
            icon={k.icon}
            color={k.color}
          />
        ))}
      </motion.div>

      <ChartsRow />
      <BillingTable />
    </motion.div>
  );
};

export default BillingPage;
