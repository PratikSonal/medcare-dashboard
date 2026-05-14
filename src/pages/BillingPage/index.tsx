import { useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import type { BillingRecord } from "@/features/billing/types";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { formatCompact } from "@/utils";
import { container, item } from "./constants";
import { ChartsRow } from "./components/ChartsRow";
import { BillingTable } from "./components/BillingTable";

const BillingPage = (): React.ReactElement => {
  const records = useAppSelector((s: RootState) => s.billing.records);

  const totalBilled = useMemo(() => records.reduce((s: number, r: BillingRecord) => s + r.totalAmount, 0), [records]);
  const insuranceCoveredTotal = useMemo(
    () => records.reduce((s: number, r: BillingRecord) => s + r.insuranceCovered, 0),
    [records],
  );
  const patientDueTotal = useMemo(() => records.reduce((s: number, r: BillingRecord) => s + r.patientDue, 0), [records]);
  const pendingRecords = useMemo(() => records.filter((r: BillingRecord) => r.claimStatus === "Pending"), [records]);
  const pendingAmount = useMemo(
    () => pendingRecords.reduce((s: number, r: BillingRecord) => s + r.totalAmount, 0),
    [pendingRecords],
  );

  const kpis = useMemo(
    () => [
      {
        title: "Total Billed",
        rawValue: totalBilled,
        format: formatCompact,
        sub: `${records.length} records`,
        icon: <CreditCard size={20} />,
        color: "var(--accent-blue)",
      },
      {
        title: "Insurance Settled",
        rawValue: insuranceCoveredTotal,
        format: formatCompact,
        sub: `${Math.round((insuranceCoveredTotal / totalBilled) * 100)}% of total`,
        icon: <CheckCircle size={20} />,
        color: "var(--accent-cyan)",
      },
      {
        title: "Patient Outstanding",
        rawValue: patientDueTotal,
        format: formatCompact,
        sub: "Across all visits",
        icon: <TrendingUp size={20} />,
        color: "var(--accent-purple)",
      },
      {
        title: "Pending Claims",
        rawValue: pendingRecords.length,
        sub: formatCompact(pendingAmount) + " at risk",
        icon: <Clock size={20} />,
        color: "var(--accent-yellow)",
      },
    ],
    [totalBilled, insuranceCoveredTotal, patientDueTotal, pendingRecords.length, pendingAmount, records.length],
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
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8"
      >
        {kpis.map(kpi => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </motion.div>

      <ChartsRow />
      <BillingTable />
    </motion.div>
  );
};

export default BillingPage;
