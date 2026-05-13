import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient, clearFilters } from "@/features/patients/patientsSlice";
import { metricsData } from "@/lib/mockData";
import { getStatusBg, getStatusColor, cn } from "@/lib/utils";
import { item } from "../constants";

export const TrendsRow = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patients = useAppSelector(s => s.patients.patients);
  const [chartPeriod, setChartPeriod] = useState<"3M" | "6M" | "All">("All");

  const chartData = useMemo(
    () =>
      chartPeriod === "3M"
        ? metricsData.slice(-3)
        : chartPeriod === "6M"
          ? metricsData.slice(-6)
          : metricsData,
    [chartPeriod],
  );

  return (
    <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: "1fr 340px" }}>
      {/* Patient Trends Chart */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Patient Trends</h2>
            <p className="text-[13px] text-text-secondary mt-[2px]">Monthly overview</p>
          </div>
          <div className="flex gap-[6px]">
            {(["3M", "6M", "All"] as const).map(p => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={cn(
                  "px-3 py-[5px] rounded-[8px] text-xs font-medium cursor-pointer font-sans transition-all duration-200 border-0",
                  chartPeriod === p
                    ? "bg-accent-blue text-white"
                    : "bg-bg-tertiary text-text-secondary",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
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
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontFamily: "Poppins",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--text-primary)", fontFamily: "Poppins" }}
              itemStyle={{ color: "var(--text-secondary)", fontFamily: "Poppins" }}
            />
            <Area
              type="monotone"
              dataKey="patients"
              name="Patients"
              stroke="var(--accent-blue)"
              strokeWidth={2}
              fill="url(#pG)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="recovered"
              name="Recovered"
              stroke="var(--accent-cyan)"
              strokeWidth={2}
              fill="url(#rG)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-blue" />
            <span className="text-xs text-text-secondary">Total Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-cyan" />
            <span className="text-xs text-text-secondary">Recovered</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Patients */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Recent Patients</h2>
          <button
            onClick={() => {
              dispatch(clearFilters());
              navigate("/patients");
            }}
            className="flex items-center gap-[3px] text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans font-medium"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex flex-col gap-[6px]">
          {patients.slice(0, 6).map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
              onClick={() => dispatch(setSelectedPatient(patient))}
              className="flex items-center gap-[10px] px-[10px] py-[9px] rounded-12 cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary"
            >
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              >
                {patient.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                  {patient.name}
                </p>
                <p className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
                  {patient.diagnosis}
                </p>
              </div>
              <span
                className="text-[10px] font-medium px-[7px] py-[3px] rounded-[8px] shrink-0"
                style={{
                  background: getStatusBg(patient.status),
                  color: getStatusColor(patient.status),
                }}
              >
                {patient.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
