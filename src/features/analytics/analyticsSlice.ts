import { createSlice } from "@reduxjs/toolkit";
import { metricsData, departmentStats } from "@/data/analytics";
import type { MetricDataPoint, DepartmentStat } from "./types";

interface AnalyticsState {
  metrics: MetricDataPoint[];
  departmentStats: DepartmentStat[];
}

const initialState: AnalyticsState = {
  metrics: metricsData,
  departmentStats,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;
