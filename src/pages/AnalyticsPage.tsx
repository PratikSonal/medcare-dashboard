import { useCountUp } from '@/hooks/useCountUp';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';
import { TrendingUp, DollarSign, Users, Activity, ChevronRight } from 'lucide-react';
import { metricsData, departmentStats, mockBillingData } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setFilterStatus, clearFilters } from '@/features/patients/patientsSlice';
import { formatCompact, PROVIDER_SHORT } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const ttStyle = { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'Poppins', fontSize: '12px' } };

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};


const PROC_COLORS = ['#3c83f6', '#7c3bed', '#0ea5e9', '#f59e0b', '#6366f1'];


export default function AnalyticsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const patients = useAppSelector(s => s.patients.patients);
  const totalPatients = metricsData.reduce((s, d) => s + d.patients, 0);
  const totalRevenue = metricsData.reduce((s, d) => s + d.revenue, 0);
  const totalAppointments = metricsData.reduce((s, d) => s + d.appointments, 0);
  const totalRecovered = metricsData.reduce((s, d) => s + d.recovered, 0);
  const recoveryRate = Math.round((totalRecovered / totalPatients) * 100);

  const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
  const insuranceCovered = mockBillingData.reduce((s, r) => s + r.insuranceCovered, 0);
  const patientDue = mockBillingData.reduce((s, r) => s + r.patientDue, 0);
  const coveragePct = Math.round((insuranceCovered / totalBilled) * 100);

  const providerMap: Record<string, { total: number; covered: number; due: number; claims: number }> = {};
  mockBillingData.forEach(r => {
    const name = PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider;
    if (!providerMap[name]) providerMap[name] = { total: 0, covered: 0, due: 0, claims: 0 };
    providerMap[name].total += r.totalAmount;
    providerMap[name].covered += r.insuranceCovered;
    providerMap[name].due += r.patientDue;
    providerMap[name].claims++;
  });
  const providerData = Object.entries(providerMap)
    .map(([name, d]) => ({ name, ...d, rate: Math.round((d.covered / d.total) * 100) }))
    .sort((a, b) => b.total - a.total);

  const topProcedures = [...mockBillingData]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  const doctorMap: Record<string, { total: number; active: number; critical: number; recovering: number; discharged: number; depts: Set<string> }> = {};
  patients.forEach(p => {
    if (!doctorMap[p.doctor]) doctorMap[p.doctor] = { total: 0, active: 0, critical: 0, recovering: 0, discharged: 0, depts: new Set() };
    doctorMap[p.doctor].total++;
    doctorMap[p.doctor].depts.add(p.department);
    if (p.status === 'Active') doctorMap[p.doctor].active++;
    else if (p.status === 'Critical') doctorMap[p.doctor].critical++;
    else if (p.status === 'Recovering') doctorMap[p.doctor].recovering++;
    else if (p.status === 'Discharged') doctorMap[p.doctor].discharged++;
  });
  const doctorData = Object.entries(doctorMap)
    .map(([name, d]) => ({ name, ...d, depts: Array.from(d.depts) }))
    .sort((a, b) => b.total - a.total);

  const patientsCount = useCountUp(totalPatients);
  const revenueCount = useCountUp(Math.round(totalRevenue / 10000));
  const appointmentsCount = useCountUp(totalAppointments);
  const rateCount = useCountUp(recoveryRate);

  const kpis = [
    { title: 'Total Patients', display: patientsCount.toLocaleString(), sub: '7-month period', icon: <Users size={20} />, color: '#3c83f6', onClick: () => { dispatch(clearFilters()); navigate('/patients'); } },
    { title: 'Total Revenue', display: `₹${(revenueCount / 10).toFixed(1)}L`, sub: 'Nov 2025 – May 2026', icon: <DollarSign size={20} />, color: '#0ea5e9', onClick: () => navigate('/billing') },
    { title: 'Appointments', display: appointmentsCount.toLocaleString(), sub: 'All scheduled visits', icon: <Activity size={20} />, color: '#7c3bed', onClick: () => navigate('/appointments') },
    { title: 'Recovery Rate', display: `${rateCount}%`, sub: `${totalRecovered.toLocaleString()} patients recovered`, icon: <TrendingUp size={20} />, color: '#f59e0b', onClick: () => { dispatch(setFilterStatus('Discharged')); navigate('/patients'); } },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Analytics</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Performance insights and health metrics</p>
          </div>
          <Badge variant="info">Nov 2025 — May 2026</Badge>
        </div>
        <div className="glow-line" style={{ marginTop: '24px' }} />
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpis.map(k => (
          <motion.div key={k.title} className="glass-card"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            onClick={k.onClick}
            style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${k.color}, transparent)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{k.title}</p>
                <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{k.display}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>{k.sub}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: `${k.color}18`, color: k.color }}>{k.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#0ea5e9', fontSize: '11px' }}>
                  View <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 1: Revenue Chart + Department Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', marginBottom: '24px' }}>
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Overview</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Monthly revenue in INR</p>
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

        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>By Department</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Patient distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie data={departmentStats} dataKey="patients" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} labelLine={false} label={renderLabel}>
                {departmentStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...ttStyle} formatter={(v) => [`${v} patients`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
            {departmentStats.map(dept => (
              <div key={dept.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dept.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{dept.name}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{dept.patients}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Appointments vs Recovered + Patient Volume */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Appointments vs Recovered</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Monthly comparison</p>
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

        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Volume Trend</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Total admissions over time</p>
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
      <motion.div variants={item} style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Financial Breakdown</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Insurance coverage and billing analysis</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

          {/* Provider Coverage Table */}
          <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Provider Coverage Analysis</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Total billed vs. insurance settled per provider</p>

            <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Insurance Settled</span>
                  <p style={{ fontSize: '17px', fontWeight: 700, color: '#0ea5e9', marginTop: '2px' }}>{formatCompact(insuranceCovered)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Patient Outstanding</span>
                  <p style={{ fontSize: '17px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>{formatCompact(patientDue)}</p>
                </div>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'var(--border-primary)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${coveragePct}%`, background: 'linear-gradient(90deg, #0ea5e9, #3c83f6)', borderRadius: '999px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: 600 }}>{coveragePct}% covered</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Total: {formatCompact(totalBilled)}</span>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {['Provider', 'Total Billed', 'Coverage', 'Rate'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {providerData.map((p, i) => (
                  <tr key={p.name} style={{ borderBottom: i < providerData.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{formatCompact(p.total)}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ width: '64px', height: '5px', borderRadius: '999px', background: 'var(--border-primary)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.rate}%`, background: p.rate > 60 ? '#0ea5e9' : p.rate > 30 ? '#f59e0b' : '#ef4444', borderRadius: '999px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: p.rate > 60 ? '#0ea5e9' : p.rate > 30 ? '#f59e0b' : '#ef4444' }}>{p.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Procedures */}
          <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Top Procedures</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Highest billed procedures this period</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProcedures.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: PROC_COLORS[i] + '20', color: PROC_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.procedure}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{p.department} · {p.patientName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: 'var(--border-primary)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round((p.totalAmount / topProcedures[0].totalAmount) * 100)}%`, background: PROC_COLORS[i], borderRadius: '999px' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>₹{p.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Doctor Performance */}
      <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Doctor Performance</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Patient load and status breakdown per physician</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Doctor', 'Total', 'Active', 'Critical', 'Recovering', 'Discharged', 'Departments'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctorData.map((d, i) => (
                <tr key={d.name} style={{ borderBottom: i < doctorData.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar initials={d.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)} size={32} radius="50%" />
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.total}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {d.active ? <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>{d.active}</span> : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {d.critical ? <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{d.critical}</span> : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {d.recovering ? <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{d.recovering}</span> : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {d.discharged ? <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(107,114,128,0.1)', color: 'var(--text-tertiary)' }}>{d.discharged}</span> : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {d.depts.map(dept => (
                        <span key={dept} style={{ fontSize: '10px', fontWeight: 500, padding: '2px 7px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{dept}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
