import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Trophy } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCompact, PROVIDER_SHORT } from "@/lib/utils";
import { CLAIM_STATUS_COLORS } from "@/lib/constants";
import { item, ttStyle, ALL_STATUSES } from "../constants";

export const ChartsRow = () => {
  const records = useAppSelector(s => s.billing.records);

  const providerData = useMemo(() => {
    const map: Record<
      string,
      { approved: number; partial: number; pending: number; denied: number }
    > = {};
    records.forEach(r => {
      const name = PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider;
      if (!map[name]) map[name] = { approved: 0, partial: 0, pending: 0, denied: 0 };
      const key = r.claimStatus.toLowerCase() as "approved" | "partial" | "pending" | "denied";
      map[name][key]++;
    });
    return Object.entries(map).map(([name, counts]) => ({ name, ...counts }));
  }, [records]);

  const claimStatusData = useMemo(
    () =>
      ALL_STATUSES.map(s => ({
        name: s,
        value: records.filter(r => r.claimStatus === s).length,
        color: CLAIM_STATUS_COLORS[s].color,
      })),
    [records],
  );

  const leaderboard = useMemo(
    () => [...records].sort((a, b) => b.patientDue - a.patientDue).slice(0, 5),
    [records],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-6 mb-6">
      {/* Provider Performance */}
      <motion.div variants={item} className="glass-card rounded-20 p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-text-primary">Provider Performance</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">
            Claims by status per insurance provider
          </p>
        </div>
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={providerData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              barSize={14}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-primary)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip {...ttStyle} />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  paddingTop: "12px",
                }}
              />
              <Bar
                dataKey="approved"
                name="Approved"
                stackId="a"
                fill="var(--accent-cyan)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="partial" name="Partial" stackId="a" fill="var(--accent-purple)" />
              <Bar dataKey="pending" name="Pending" stackId="a" fill="var(--accent-yellow)" />
              <Bar
                dataKey="denied"
                name="Denied"
                stackId="a"
                fill="var(--accent-red)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Claim Status Donut */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-text-primary">Claim Status</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">{records.length} total claims</p>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={claimStatusData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
            >
              {claimStatusData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...ttStyle} formatter={v => [`${v} claims`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 mt-1">
          {claimStatusData.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-text-secondary">{s.name}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="text-xs font-semibold text-text-primary">{s.value}</span>
                <span className="text-[11px] text-text-tertiary">
                  {records.length > 0 ? Math.round((s.value / records.length) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outstanding Balance Leaderboard */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={15} className="text-accent-yellow" />
          <h2 className="text-base font-semibold text-text-primary">Outstanding Balance</h2>
        </div>
        <p className="text-[13px] text-text-secondary mb-4">Top 5 by patient due amount</p>
        <div className="flex flex-col gap-3">
          {leaderboard.map((r, i) => (
            <motion.div
              key={r.id}
              whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
              className="flex items-center gap-[10px] px-2 py-1 -mx-2 rounded-[10px] cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary"
            >
              <span
                className={cn(
                  "text-[11px] font-bold w-[18px] shrink-0 text-right",
                  i === 0 ? "text-accent-yellow" : "text-text-tertiary",
                )}
              >
                #{i + 1}
              </span>
              <Avatar initials={r.patientAvatar} size={28} radius="50%" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                  {r.patientName}
                </p>
                <p className="text-[11px] text-text-tertiary">{r.department}</p>
              </div>
              <span
                className={cn(
                  "text-xs font-bold shrink-0",
                  r.patientDue > 50000 ? "text-accent-red" : "text-text-primary",
                )}
              >
                {formatCompact(r.patientDue)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
