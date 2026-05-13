export interface MetricDataPoint {
  month: string;
  patients: number;
  revenue: number;
  appointments: number;
  recovered: number;
}

export interface DepartmentStat {
  name: string;
  patients: number;
  color: string;
}
