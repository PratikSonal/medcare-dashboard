import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { metricsData, departmentStats, mockBillingData } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import { Avatar } from '@/components/ui/Avatar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setFilterStatus, clearFilters } from '@/features/patients/patientsSlice';
import { formatCompact, PROVIDER_SHORT } from '@/lib/utils';
import { container, item, ttStyle, RADIAN, PROC_COLORS } from './constants';

// Module-level constants — computed once from static imported data
const totalPatients = metricsData.reduce((s, d) => s + d.patients, 0);
const totalRevenue = metricsData.reduce((s, d) => s + d.revenue, 0);
const totalAppointments = metricsData.reduce((s, d) => s + d.appointments, 0);
const totalRecovered = metricsData.reduce((s, d) => s + d.recovered, 0);
const recoveryRate = Math.round((totalRecovered / totalPatients) * 100);
const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
const insuranceCovered = mockBillingData.reduce((s, r) => s + r.insuranceCovered, 0);
const patientDue = mockBillingData.reduce((s, r) => s + r.patientDue, 0);
const coveragePct = Math.round((insuranceCovered / totalBilled) * 100);
const topProcedures = [...mockBillingData].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);
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

const STATUS_CELLS: { key: 'active' | 'critical' | 'recovering' | 'discharged'; bg: string; color: string }[] = [
  { key: 'active',     bg: 'rgba(14,165,233,0.1)',  color: '#0ea5e9' },
  { key: 'critical',   bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  { key: 'recovering', bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
  { key: 'discharged', bg: 'rgba(107,114,128,0.1)', color: 'var(--text-tertiary)' },
];

const renderLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const patients = useAppSelector(s => s.patients.patients);

  const doctorData = useMemo(() => {
    const map: Record<string, { total: number; active: number; critical: number; recovering: number; discharged: number; depts: Set<string> }> = {};
    patients.forEach(p => {
      if (!map[p.doctor]) map[p.doctor] = { total: 0, active: 0, critical: 0, recovering: 0, discharged: 0, depts: new Set() };
      map[p.doctor].total++;
      map[p.doctor].depts.add(p.department);
      if (p.status === 'Active') map[p.doctor].active++;
      else if (p.status === 'Critical') map[p.doctor].critical++;
      else if (p.status === 'Recovering') map[p.doctor].recovering++;
      else if (p.status === 'Discharged') map[p.doctor].discharged++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d, depts: Array.from(d.depts) }))
      .sort((a, b) => b.total - a.total);
  }, [patients]);

  const kpis = [
    { title: 'Total Patients', rawValue: totalPatients,                        sub: '7-month period',                                        icon: <Users size={20} />,      color: '#3c83f6', onClick: () => { dispatch(clearFilters()); navigate('/patients'); } },
    { title: 'Total Revenue',  rawValue: Math.round(totalRevenue / 10000),     format: (n: number) => `₹${(n / 10).toFixed(1)}L`,            icon: <DollarSign size={20} />, color: '#0ea5e9', sub: 'Nov 2025 – May 2026',                                   onClick: () => navigate('/billing') },
    { title: 'Appointments',   rawValue: totalAppointments,                    sub: 'All scheduled visits',                                  icon: <Activity size={20} />,   color: '#7c3bed', onClick: () => navigate('/appointments') },
    { title: 'Recovery Rate',  rawValue: recoveryRate, suffix: '%',            sub: `${totalRecovered.toLocaleString()} patients recovered`, icon: <TrendingUp size={20} />, color: '#f59e0b', onClick: () => { dispatch(setFilterStatus('Discharged')); navigate('/patients'); } },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1280px] mx-auto">

      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">Analytics</h1>
            <p className="text-sm text-text-secondary mt-1">Performance insights and health metrics</p>
          </div>
          <Badge variant="info">Nov 2025 — May 2026</Badge>
        </div>
        <div className="glow-line mt-6" />
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {kpis.map(k => (
          <KpiCard key={k.title} rawValue={k.rawValue} format={k.format} suffix={k.suffix} sub={k.sub} icon={k.icon} color={k.color} onClick={k.onClick} title={k.title} showArrow />
        ))}
      </motion.div>

      {/* Row 1: Revenue Chart + Department Donut */}
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 320px' }}>
        <motion.div variants={item} className="glass-card rounded-20 p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
            <p className="text-[13px] text-text-secondary mt-[2px]">Monthly revenue in INR</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metricsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip {...ttStyle} formatter={(v) => [`₹${((v as number) / 1000).toFixed(0)}K`, 'Revenue']} cursor={{ fill: 'rgba(60,131,246,0.05)' }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {metricsData.map((_, i) => <Cell key={i} fill={i === metricsData.length - 1 ? '#3c83f6' : 'rgba(60,131,246,0.35)'} />)}
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
              <Pie data={departmentStats} dataKey="patients" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} labelLine={false} label={renderLabel}>
                {departmentStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...ttStyle} formatter={(v) => [`${v} patients`]} />
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

      {/* Row 2: Appointments vs Recovered + Patient Volume */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <motion.div variants={item} className="glass-card rounded-20 p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-primary">Appointments vs Recovered</h2>
            <p className="text-[13px] text-text-secondary mt-[2px]">Monthly comparison</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metricsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...ttStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
              <Line type="monotone" dataKey="appointments" name="Appointments" stroke="#7c3bed" strokeWidth={2} dot={{ fill: '#7c3bed', r: 4 }} />
              <Line type="monotone" dataKey="recovered" name="Recovered" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} />
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
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...ttStyle} />
              <Area type="monotone" dataKey="patients" name="Patients" stroke="#0ea5e9" strokeWidth={2} fill="url(#vG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Financial Breakdown */}
      <motion.div variants={item} className="mb-6">
        <div className="mb-5">
          <h2 className="text-[18px] font-bold text-text-primary">Financial Breakdown</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">Insurance coverage and billing analysis</p>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px' }}>
          <div className="glass-card rounded-20 p-6">
            <h3 className="text-[15px] font-semibold text-text-primary mb-1">Provider Coverage Analysis</h3>
            <p className="text-xs text-text-secondary mb-5">Total billed vs. insurance settled per provider</p>
            <div className="mb-5 p-4 bg-bg-tertiary rounded-[14px]">
              <div className="flex justify-between mb-[10px]">
                <div>
                  <span className="text-[11px] text-text-tertiary">Insurance Settled</span>
                  <p className="text-[17px] font-bold text-[#0ea5e9] mt-[2px]">{formatCompact(insuranceCovered)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-text-tertiary">Patient Outstanding</span>
                  <p className="text-[17px] font-bold text-[#ef4444] mt-[2px]">{formatCompact(patientDue)}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-border-primary overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${coveragePct}%`, background: 'linear-gradient(90deg, #0ea5e9, #3c83f6)' }} />
              </div>
              <div className="flex justify-between mt-[6px]">
                <span className="text-[11px] text-[#0ea5e9] font-semibold">{coveragePct}% covered</span>
                <span className="text-[11px] text-text-tertiary">Total: {formatCompact(totalBilled)}</span>
              </div>
            </div>
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="border-b border-border-primary">
                  {['Provider', 'Total Billed', 'Coverage', 'Rate'].map(h => (
                    <th key={h} className="text-left px-2 py-[6px] text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.05em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {providerData.map((p, i) => (
                  <motion.tr key={p.name} whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }} className={cn('cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary', i < providerData.length - 1 && 'border-b border-border-primary')}>
                    <td className="px-2 py-[10px] font-medium text-text-primary">{p.name}</td>
                    <td className="px-2 py-[10px] text-text-secondary">{formatCompact(p.total)}</td>
                    <td className="px-2 py-[10px]">
                      <div className="w-16 h-[5px] rounded-full bg-border-primary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.rate}%`, background: p.rate > 60 ? '#0ea5e9' : p.rate > 30 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                    </td>
                    <td className="px-2 py-[10px] font-bold" style={{ color: p.rate > 60 ? '#0ea5e9' : p.rate > 30 ? '#f59e0b' : '#ef4444' }}>{p.rate}%</td>
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
                <motion.div key={p.id} whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }} className="flex gap-3 items-start px-3 py-2 -mx-3 rounded-[12px] cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary">
                  <div className="w-6 h-6 rounded-[8px] flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: PROC_COLORS[i] + '20', color: PROC_COLORS[i] }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{p.procedure}</p>
                    <p className="text-[11px] text-text-tertiary mt-[2px]">{p.department} · {p.patientName}</p>
                    <div className="flex items-center gap-2 mt-[6px]">
                      <div className="flex-1 h-1 rounded-full bg-border-primary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((p.totalAmount / topProcedures[0].totalAmount) * 100)}%`, background: PROC_COLORS[i] }} />
                      </div>
                      <span className="text-[11px] font-semibold text-text-primary whitespace-nowrap">₹{p.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Doctor Performance */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-text-primary">Doctor Performance</h2>
          <p className="text-[13px] text-text-secondary mt-[2px]">Patient load and status breakdown per physician</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-border-primary">
                {['Doctor', 'Total', 'Active', 'Critical', 'Recovering', 'Discharged', 'Departments'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctorData.map((d, i) => (
                <motion.tr key={d.name} whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }} className={cn('cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary', i < doctorData.length - 1 && 'border-b border-border-primary')}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-[10px]">
                      <Avatar initials={d.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)} size={32} radius="50%" />
                      <span className="font-medium text-text-primary whitespace-nowrap">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-[15px] font-bold text-text-primary">{d.total}</span></td>
                  {STATUS_CELLS.map(({ key, bg, color }) => (
                    <td key={key} className="px-3 py-3">
                      {d[key] ? <span className="text-xs font-semibold px-2 py-[3px] rounded-[6px]" style={{ background: bg, color }}>{d[key]}</span> : <span className="text-xs text-text-tertiary">—</span>}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {d.depts.map(dept => (
                        <span key={dept} className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px] bg-bg-tertiary text-text-secondary whitespace-nowrap">{dept}</span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default AnalyticsPage;
