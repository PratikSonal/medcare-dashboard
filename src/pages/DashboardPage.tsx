import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, AlertTriangle, Calendar, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { Badge } from '@/components/ui/Badge';
import { metricsData, mockPatients } from '@/lib/mockData';
import { formatDate, getStatusBg, getStatusColor } from '@/lib/utils';
import { showDailySummaryNotification } from '@/lib/notifications';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.round(start));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

function AnimatedStatCard({ title, rawValue, change, positive = true, icon, color = 'var(--accent-blue)', prefix = '', suffix = '' }:
  { title: string; rawValue: number; change?: string; positive?: boolean; icon: React.ReactNode; color?: string; prefix?: string; suffix?: string }) {
  const count = useCountUp(rawValue);
  return (
    <motion.div variants={item} className="glass-card"
      style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${color}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {prefix}{count}{suffix}
          </p>
          {change && (
            <p style={{ fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: positive ? '#0ea5e9' : 'var(--accent-red)' }}>
              <span>{positive ? '↑' : '↓'}</span>{change}
            </p>
          )}
        </div>
        <div style={{ padding: '12px', borderRadius: '12px', background: `${color}18`, color }}>{icon}</div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useAppSelector(s => s.auth.user);
  const patients = mockPatients;
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const activeCount = patients.filter(p => p.status === 'Active').length;

  useEffect(() => {
    const t = setTimeout(() => showDailySummaryNotification(patients.length, criticalCount), 5000);
    return () => clearTimeout(t);
  }, [patients.length, criticalCount]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{greeting} 👋</p>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.displayName || 'Dr. Admin'}</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {criticalCount > 0 && (
            <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--accent-red)' }}>
              <AlertTriangle size={16} /> {criticalCount} Critical Patient{criticalCount > 1 ? 's' : ''}
            </motion.div>
          )}
        </div>
        <div className="glow-line" style={{ marginTop: '24px' }} />
      </motion.div>

      {/* Animated Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <AnimatedStatCard title="Total Patients" rawValue={patients.length} change="12% this month" positive icon={<Users size={20} />} color="#3c83f6" />
        <AnimatedStatCard title="Active Cases" rawValue={activeCount} change="8% this week" positive icon={<Activity size={20} />} color="#0ea5e9" />
        <AnimatedStatCard title="Critical Alerts" rawValue={criticalCount} change="2 new today" positive={false} icon={<AlertTriangle size={20} />} color="var(--accent-red)" />
        <AnimatedStatCard title="Appointments Today" rawValue={42} change="15% this week" positive icon={<Calendar size={20} />} color="#7c3bed" />
      </div>

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }}>
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Trends</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Monthly overview</p>
            </div>
            <Badge variant="info">Last 7 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={metricsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3c83f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3c83f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'Poppins', fontSize: '12px' }} />
              <Area type="monotone" dataKey="patients" name="Patients" stroke="#3c83f6" strokeWidth={2} fill="url(#pG)" dot={false} />
              <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#0ea5e9" strokeWidth={2} fill="url(#rG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3c83f6' }} /><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Patients</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0ea5e9' }} /><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Recovered</span></div>
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Patients</h2>
            <TrendingUp size={16} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {patients.slice(0, 6).map((patient, i) => (
              <motion.div key={patient.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '12px', cursor: 'pointer', transition: 'background 200ms ease' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>{patient.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.diagnosis}</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 500, padding: '3px 7px', borderRadius: '8px', flexShrink: 0, background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick stats */}
      <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, color: 'var(--text-tertiary)' },
          { label: 'Recovering', value: patients.filter(p => p.status === 'Recovering').length, color: 'var(--accent-yellow)' },
          { label: 'Departments', value: [...new Set(patients.map(p => p.department))].length, color: '#7c3bed' },
          { label: 'Doctors', value: [...new Set(patients.map(p => p.doctor))].length, color: '#3c83f6' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Calendar size={16} style={{ color: '#3c83f6' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Overview</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Patient', 'Department', 'Doctor', 'Admitted', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 6).map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < 5 ? '1px solid var(--border-primary)' : 'none', transition: 'background 200ms ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{p.avatar}</div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.department}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.doctor}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(p.admissionDate)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '8px', background: getStatusBg(p.status), color: getStatusColor(p.status) }}>{p.status}</span>
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
