import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { item, ttStyle } from "../constants";

export const TrendsRow = (): React.ReactElement => {
  const metrics = useAppSelector((s: RootState) => s.analytics.metrics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-text-primary">Appointments vs Recovered</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">Monthly comparison</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={metrics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip {...ttStyle} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--text-secondary)" }} />
            <Line
              type="monotone"
              dataKey="appointments"
              name="Appointments"
              stroke="var(--accent-purple)"
              strokeWidth={2}
              dot={{ fill: "var(--accent-purple)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="recovered"
              name="Recovered"
              stroke="var(--accent-cyan)"
              strokeWidth={2}
              dot={{ fill: "var(--accent-cyan)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-text-primary">Patient Volume Trend</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">Total admissions over time</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={metrics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip {...ttStyle} />
            <Area
              type="monotone"
              dataKey="patients"
              name="Patients"
              stroke="var(--accent-cyan)"
              strokeWidth={2}
              fill="url(#volumeGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
