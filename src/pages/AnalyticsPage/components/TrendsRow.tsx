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
import { metricsData } from "@/lib/mockData";
import { item, ttStyle } from "../constants";

export const TrendsRow = () => (
  <div className="grid grid-cols-2 gap-6 mb-6">
    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-primary">Appointments vs Recovered</h2>
        <p className="text-[13px] text-text-secondary mt-[2px]">Monthly comparison</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={metricsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
            stroke="#7c3bed"
            strokeWidth={2}
            dot={{ fill: "#7c3bed", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="recovered"
            name="Recovered"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: "#0ea5e9", r: 4 }}
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
        <AreaChart data={metricsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
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
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#vG)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  </div>
);
