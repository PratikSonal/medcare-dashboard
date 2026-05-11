import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { metricsData, departmentStats } from '@/lib/mockData';
import { StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ttStyle = { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'Poppins', fontSize: '12px' } };

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

export default function AnalyticsPage() {
  const totalPatients = metricsData.reduce((s, d) => s + d.patients, 0);
  const totalRevenue = metricsData.reduce((s, d) => s + d.revenue, 0);
  const totalAppointments = metricsData.reduce((s, d) => s + d.appointments, 0);
  const totalRecovered = metricsData.reduce((s, d) => s + d.recovered, 0);

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

      {/* KPIs */}
      <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="Total Patients" value={totalPatients.toLocaleString()} change="12.4% vs last period" positive icon={<Users size={20} />} color="var(--accent-blue)" />
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change="18.2% vs last period" positive icon={<DollarSign size={20} />} color="var(--accent-green)" />
        <StatCard title="Appointments" value={totalAppointments.toLocaleString()} change="9.8% vs last period" positive icon={<Activity size={20} />} color="var(--accent-purple)" />
        <StatCard title="Recovery Rate" value={`${Math.round((totalRecovered / totalPatients) * 100)}%`} change="4.2% improvement" positive icon={<TrendingUp size={20} />} color="var(--accent-yellow)" />
      </motion.div>

      {/* Row 1 */}
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
              <Tooltip {...ttStyle} formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, 'Revenue']} cursor={{ fill: 'rgba(60,131,246,0.05)' }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {metricsData.map((_, i) => <Cell key={i} fill={i === metricsData.length - 1 ? '#3c83f6' : 'rgba(60,131,246,0.4)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>By Department</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Patient distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departmentStats} dataKey="patients" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} labelLine={false} label={renderLabel}>
                {departmentStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...ttStyle} formatter={(v) => [`${v} patients`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {departmentStats.slice(0, 5).map(dept => (
              <div key={dept.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dept.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{dept.name}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{dept.patients}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
              <Line type="monotone" dataKey="recovered" name="Recovered" stroke="#10bc83" strokeWidth={2} dot={{ fill: '#10bc83', r: 4 }} />
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
                  <stop offset="5%" stopColor="#10bc83" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10bc83" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...ttStyle} />
              <Area type="monotone" dataKey="patients" name="Patients" stroke="#10bc83" strokeWidth={2} fill="url(#vG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
