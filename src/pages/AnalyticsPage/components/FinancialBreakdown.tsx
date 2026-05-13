import { motion } from "framer-motion";
import { cn, formatCompact, PROVIDER_SHORT } from "@/lib/utils";
import { mockBillingData } from "@/lib/mockData";
import { item, PROC_COLORS } from "../constants";

const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
const insuranceCovered = mockBillingData.reduce((s, r) => s + r.insuranceCovered, 0);
const patientDue = mockBillingData.reduce((s, r) => s + r.patientDue, 0);
const coveragePct = Math.round((insuranceCovered / totalBilled) * 100);
const topProcedures = [...mockBillingData]
  .sort((a, b) => b.totalAmount - a.totalAmount)
  .slice(0, 5);
const providerData = (() => {
  const map: Record<string, { total: number; covered: number; due: number; claims: number }> = {};
  mockBillingData.forEach(r => {
    const name = PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider;
    if (!map[name]) map[name] = { total: 0, covered: 0, due: 0, claims: 0 };
    map[name].total += r.totalAmount;
    map[name].covered += r.insuranceCovered;
    map[name].due += r.patientDue;
    map[name].claims++;
  });
  return Object.entries(map)
    .map(([name, d]) => ({ name, ...d, rate: Math.round((d.covered / d.total) * 100) }))
    .sort((a, b) => b.total - a.total);
})();

export const FinancialBreakdown = () => (
  <motion.div variants={item} className="mb-6">
    <div className="mb-5">
      <h2 className="text-[18px] font-bold text-text-primary">Financial Breakdown</h2>
      <p className="text-[13px] text-text-secondary mt-[2px]">
        Insurance coverage and billing analysis
      </p>
    </div>
    <div className="grid grid-cols-[1fr_340px] gap-6">
      <div className="glass-card rounded-20 p-6">
        <h3 className="text-[15px] font-semibold text-text-primary mb-1">
          Provider Coverage Analysis
        </h3>
        <p className="text-xs text-text-secondary mb-5">
          Total billed vs. insurance settled per provider
        </p>
        <div className="mb-5 p-4 bg-bg-tertiary rounded-[14px]">
          <div className="flex justify-between mb-[10px]">
            <div>
              <span className="text-[11px] text-text-tertiary">Insurance Settled</span>
              <p className="text-[17px] font-bold text-accent-cyan mt-[2px]">
                {formatCompact(insuranceCovered)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-text-tertiary">Patient Outstanding</span>
              <p className="text-[17px] font-bold text-accent-red mt-[2px]">
                {formatCompact(patientDue)}
              </p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-border-primary overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${coveragePct}%`,
                background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))",
              }}
            />
          </div>
          <div className="flex justify-between mt-[6px]">
            <span className="text-[11px] text-accent-cyan font-semibold">{coveragePct}% covered</span>
            <span className="text-[11px] text-text-tertiary">
              Total: {formatCompact(totalBilled)}
            </span>
          </div>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-primary">
              {["Provider", "Total Billed", "Coverage", "Rate"].map(h => (
                <th
                  key={h}
                  className="text-left px-2 py-[6px] text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.05em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providerData.map((p, i) => (
              <motion.tr
                key={p.name}
                whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
                className={cn(
                  "cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary",
                  i < providerData.length - 1 && "border-b border-border-primary",
                )}
              >
                <td className="px-2 py-[10px] font-medium text-text-primary">{p.name}</td>
                <td className="px-2 py-[10px] text-text-secondary">{formatCompact(p.total)}</td>
                <td className="px-2 py-[10px]">
                  <div className="w-16 h-[5px] rounded-full bg-border-primary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.rate}%`,
                        background: p.rate > 60 ? "var(--accent-cyan)" : p.rate > 30 ? "var(--accent-yellow)" : "var(--accent-red)",
                      }}
                    />
                  </div>
                </td>
                <td
                  className="px-2 py-[10px] font-bold"
                  style={{ color: p.rate > 60 ? "var(--accent-cyan)" : p.rate > 30 ? "var(--accent-yellow)" : "var(--accent-red)" }}
                >
                  {p.rate}%
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card rounded-20 p-6">
        <h3 className="text-[15px] font-semibold text-text-primary mb-1">Top Procedures</h3>
        <p className="text-xs text-text-secondary mb-5">Highest billed procedures this period</p>
        <div className="flex flex-col gap-4">
          {topProcedures.map((p, i) => (
            <motion.div
              key={p.id}
              whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
              className="flex gap-3 items-start px-3 py-2 -mx-3 rounded-[12px] cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary"
            >
              <div
                className="w-6 h-6 rounded-[8px] flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: PROC_COLORS[i] + "20", color: PROC_COLORS[i] }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                  {p.procedure}
                </p>
                <p className="text-[11px] text-text-tertiary mt-[2px]">
                  {p.department} · {p.patientName}
                </p>
                <div className="flex items-center gap-2 mt-[6px]">
                  <div className="flex-1 h-1 rounded-full bg-border-primary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((p.totalAmount / topProcedures[0].totalAmount) * 100)}%`,
                        background: PROC_COLORS[i],
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-text-primary whitespace-nowrap">
                    ₹{p.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);
