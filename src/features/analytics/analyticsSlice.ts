import { createSlice } from "@reduxjs/toolkit";

import { departmentStats,metricsData } from "@/data/analytics";

import type { DepartmentStat,MetricDataPoint } from "./types";

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
