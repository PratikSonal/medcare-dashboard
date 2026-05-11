import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, AlertTriangle, Calendar, CreditCard, UserCheck, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { metricsData, mockBillingData } from '@/lib/mockData';
import { getStatusBg, getStatusColor } from '@/lib/utils';
import { showDailySummaryNotification } from '@/lib/notifications';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient, setFilterStatus, clearFilters } from '@/features/patients/patientsSlice';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const APP_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Confirmed: { color: '#3c83f6', bg: 'rgba(60,131,246,0.1)' },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Completed: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  Cancelled: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  'No-Show': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const APP_TYPE_COLORS: Record<string, string> = {
  Emergency: '#ef4444',
  'New Patient': '#7c3bed',
  'Follow-up': '#3c83f6',
  'Routine Check': '#0ea5e9',
  Consultation: '#f59e0b',
  'Dialysis Review': '#38bdf8',
  'Insulin Review': '#0ea5e9',
};

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
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

function AnimatedStatCard({ title, rawValue, change, positive = true, icon, color = 'var(--accent-blue)', prefix = '', suffix = '', onClick }:
  { title: string; rawValue: number; change?: string; positive?: boolean; icon: React.ReactNode; color?: string; prefix?: string; suffix?: string; onClick?: () => void }) {
  const count = useCountUp(rawValue);
  return (
    <motion.div variants={item} className="glass-card"
      style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${color}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{prefix}{count}{suffix}</p>
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

function RevenueStatCard({ title, value, sub, icon, color, onClick }: { title: string; value: string; sub: string; icon: React.ReactNode; color: string; onClick?: () => void }) {
  return (
    <motion.div variants={item} className="glass-card"
      style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${color}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-tertiary)' }}>{sub}</p>
        </div>
        <div style={{ padding: '12px', borderRadius: '12px', background: `${color}18`, color }}>{icon}</div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'3M' | '6M' | 'All'>('All');

  const patients = useAppSelector(s => s.patients.patients);
  const appointments = useAppSelector(s => s.appointments.appointments);
  const criticalPatients = patients.filter(p => p.status === 'Critical');
  const activeCount = patients.filter(p => p.status === 'Active').length;

  const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
  const pendingClaims = mockBillingData.filter(r => r.claimStatus === 'Pending').length;
  const approvedClaims = mockBillingData.filter(r => r.claimStatus === 'Approved').length;
  const approvalRate = Math.round((approvedClaims / mockBillingData.length) * 100);

  const todayAppointments = appointments.filter(a => a.date === '2026-05-11');
  const chartData = chartPeriod === '3M' ? metricsData.slice(-3) : chartPeriod === '6M' ? metricsData.slice(-6) : metricsData;

  useEffect(() => {
    const t = setTimeout(() => showDailySummaryNotification(patients.length, criticalPatients.length), 5000);
    return () => clearTimeout(t);
  }, [patients.length, criticalPatients.length]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Overview of patients, appointments, and revenue</p>
          </div>
          <Badge variant="info">12 May 2026</Badge>
        </div>
        <div className="glow-line" style={{ marginTop: '24px' }} />
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <AnimatedStatCard title="Total Patients" rawValue={patients.length} change="12% this month" positive icon={<Users size={20} />} color="#3c83f6"
          onClick={() => { dispatch(clearFilters()); navigate('/patients'); }} />
        <AnimatedStatCard title="Active Cases" rawValue={activeCount} change="8% this week" positive icon={<Activity size={20} />} color="#0ea5e9"
          onClick={() => { dispatch(setFilterStatus('Active')); navigate('/patients'); }} />
        <AnimatedStatCard title="Critical Alerts" rawValue={criticalPatients.length} change="2 new today" positive={false} icon={<AlertTriangle size={20} />} color="var(--accent-red)"
          onClick={() => { dispatch(setFilterStatus('Critical')); navigate('/patients'); }} />
        <AnimatedStatCard title="Appointments Today" rawValue={todayAppointments.length} change="vs 6 yesterday" positive icon={<Calendar size={20} />} color="#7c3bed"
          onClick={() => navigate('/appointments')} />
        <RevenueStatCard title="Revenue Billed" value={`₹${(totalBilled / 100000).toFixed(1)}L`} sub={`${pendingClaims} claims pending`} icon={<CreditCard size={20} />} color="#f59e0b"
          onClick={() => navigate('/billing')} />
      </div>

      {/* Critical Patients Alert */}
      {criticalPatients.length > 0 && (
        <motion.div variants={item} style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-red)' }}>
              {criticalPatients.length} Critical Patient{criticalPatients.length > 1 ? 's' : ''} — Immediate Attention Required
            </p>
            <button onClick={() => { dispatch(setFilterStatus('Critical')); navigate('/patients'); }}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, flexShrink: 0 }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {criticalPatients.map(p => (
              <div key={p.id} onClick={() => dispatch(setSelectedPatient(p))}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', flex: '1', minWidth: '220px', transition: 'background 200ms ease' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,0.14)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,0.08)'}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--accent-red)' }}>{p.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.diagnosis} · {p.department}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart + Recent Patients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }}>
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Trends</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Monthly overview</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['3M', '6M', 'All'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: chartPeriod === p ? 'var(--accent-blue)' : 'var(--bg-tertiary)', color: chartPeriod === p ? 'white' : 'var(--text-secondary)', border: 'none' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
            <button onClick={() => { dispatch(clearFilters()); navigate('/patients'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {patients.slice(0, 6).map((patient, i) => (
              <motion.div key={patient.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => dispatch(setSelectedPatient(patient))}
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

      {/* Quick Stats */}
      <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, color: 'var(--text-tertiary)', icon: <UserCheck size={16} />, desc: 'Patients released' },
          { label: 'Recovering', value: patients.filter(p => p.status === 'Recovering').length, color: 'var(--accent-yellow)', icon: <Activity size={16} />, desc: 'In recovery phase' },
          { label: 'Departments', value: [...new Set(patients.map(p => p.department))].length, color: '#7c3bed', icon: <Building2 size={16} />, desc: 'Active specialties' },
          { label: 'Doctors', value: [...new Set(patients.map(p => p.doctor))].length, color: '#3c83f6', icon: <Users size={16} />, desc: 'Attending physicians' },
          { label: 'Claim Approval', value: `${approvalRate}%`, color: '#0ea5e9', icon: <ShieldCheck size={16} />, desc: 'Insurance approved' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>{stat.label}</p>
              <div style={{ padding: '6px', borderRadius: '8px', background: `${stat.color}18`, color: stat.color, flexShrink: 0 }}>{stat.icon}</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>{stat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Today's Appointments */}
      <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Calendar size={16} style={{ color: '#3c83f6' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Today's Appointments</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>11 May 2026</span>
          <button onClick={() => navigate('/appointments')}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Time', 'Patient', 'Type', 'Doctor', 'Clinic', 'Intake & Insurance', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((app, i) => {
                const sc = APP_STATUS_COLORS[app.status];
                const typeColor = APP_TYPE_COLORS[app.type] || 'var(--accent-blue)';
                const patient = patients.find(p => p.id === app.patientId);
                return (
                  <tr key={app.id}
                    onClick={() => patient && dispatch(setSelectedPatient(patient))}
                    style={{ borderBottom: i < todayAppointments.length - 1 ? '1px solid var(--border-primary)' : 'none', transition: 'background 200ms ease', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{app.time}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{app.patientAvatar}</div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{app.patientName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, fontWeight: 500, whiteSpace: 'nowrap' }}>{app.type}</span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap' }}>{app.doctor}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '12px', maxWidth: '180px' }}>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.clinicName}</p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '5px', background: app.intakeComplete ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)', color: app.intakeComplete ? '#0ea5e9' : '#f59e0b', whiteSpace: 'nowrap' }}>
                          {app.intakeComplete ? '✓ Intake' : '⏳ Intake'}
                        </span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '5px', background: app.insuranceVerified ? 'rgba(14,165,233,0.1)' : 'rgba(239,68,68,0.1)', color: app.insuranceVerified ? '#0ea5e9' : '#ef4444', whiteSpace: 'nowrap' }}>
                          {app.insuranceVerified ? '✓ Ins.' : '✗ Ins.'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '8px', background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>{app.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
