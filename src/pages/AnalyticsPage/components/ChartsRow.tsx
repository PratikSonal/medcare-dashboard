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
} from "recharts";
import { metricsData, departmentStats } from "@/lib/mockData";
import { item, ttStyle } from "../constants";
import { renderLabel } from "../helper";

export const ChartsRow = () => (
  <div className="grid grid-cols-[1fr_320px] gap-6 mb-6">
    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
        <p className="text-[13px] text-text-secondary mt-[2px]">Monthly revenue in INR</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={metricsData}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
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
            tickFormatter={v => `₹${v / 1000}K`}
          />
          <Tooltip
            {...ttStyle}
            formatter={v => [`₹${((v as number) / 1000).toFixed(0)}K`, "Revenue"]}
            cursor={{ fill: "rgba(60,131,246,0.05)" }}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {metricsData.map((_, i) => (
              <Cell
                key={i}
                fill={i === metricsData.length - 1 ? "var(--accent-blue)" : "rgba(60,131,246,0.35)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>

    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-text-primary">By Department</h2>
        <p className="text-[13px] text-text-secondary mt-[2px]">Patient distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={155}>
        <PieChart>
          <Pie
            data={departmentStats}
            dataKey="patients"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={35}
            labelLine={false}
            label={renderLabel}
          >
            {departmentStats.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip {...ttStyle} formatter={v => [`${v} patients`]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-[5px] mt-2">
        {departmentStats.map(dept => (
          <div key={dept.name} className="flex items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dept.color }} />
              <span className="text-[11px] text-text-secondary">{dept.name}</span>
            </div>
            <span className="text-[11px] font-semibold text-text-primary">{dept.patients}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);
