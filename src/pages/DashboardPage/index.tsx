import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, AlertTriangle, Calendar, CreditCard, UserCheck, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import { metricsData, mockBillingData } from '@/lib/mockData';
import { getStatusBg, getStatusColor } from '@/lib/utils';
import { showDailySummaryNotification } from '@/lib/notifications';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient, setFilterStatus, clearFilters } from '@/features/patients/patientsSlice';
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS } from '@/lib/constants';
import { container, item } from './constants';

const DashboardPage = () => {
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
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1280px] mx-auto">

      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Overview of patients, appointments, and revenue</p>
          </div>
          <Badge variant="info">12 May 2026</Badge>
        </div>
        <div className="glow-line mt-6" />
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <KpiCard variants={item} title="Total Patients" rawValue={patients.length} change="12% this month" positive icon={<Users size={20} />} color="#3c83f6"
          onClick={() => { dispatch(clearFilters()); navigate('/patients'); }} />
        <KpiCard variants={item} title="Active Cases" rawValue={activeCount} change="8% this week" positive icon={<Activity size={20} />} color="#0ea5e9"
          onClick={() => { dispatch(setFilterStatus('Active')); navigate('/patients'); }} />
        <KpiCard variants={item} title="Critical Alerts" rawValue={criticalPatients.length} change="2 new today" positive={false} icon={<AlertTriangle size={20} />} color="var(--accent-red)"
          onClick={() => { dispatch(setFilterStatus('Critical')); navigate('/patients'); }} />
        <KpiCard variants={item} title="Appointments Today" rawValue={todayAppointments.length} change="vs 6 yesterday" positive icon={<Calendar size={20} />} color="#7c3bed"
          onClick={() => navigate('/appointments')} />
        <KpiCard variants={item} title="Revenue Billed" value={`₹${(totalBilled / 100000).toFixed(1)}L`} sub={`${pendingClaims} claims pending`} icon={<CreditCard size={20} />} color="#f59e0b"
          onClick={() => navigate('/billing')} />
      </div>

      {/* Critical Patients Alert */}
      {criticalPatients.length > 0 && (
        <motion.div variants={item} className="mb-6 px-5 py-4 rounded-16 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.25)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-accent-red shrink-0" />
            <p className="text-[13px] font-semibold text-accent-red">
              {criticalPatients.length} Critical Patient{criticalPatients.length > 1 ? 's' : ''} — Immediate Attention Required
            </p>
            <button onClick={() => { dispatch(setFilterStatus('Critical')); navigate('/patients'); }}
              className="ml-auto flex items-center gap-[3px] text-xs text-accent-red bg-transparent border-0 cursor-pointer font-sans font-medium shrink-0">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {criticalPatients.map(p => (
              <div key={p.id} onClick={() => dispatch(setSelectedPatient(p))}
                className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-12 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] cursor-pointer flex-1 min-w-[220px] transition-colors duration-200 hover:bg-[rgba(239,68,68,0.14)]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-accent-red">{p.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{p.name}</p>
                  <p className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">{p.diagnosis} · {p.department}</p>
                </div>
                <ChevronRight size={14} className="text-accent-red shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart + Recent Patients */}
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 340px' }}>
        <motion.div variants={item} className="glass-card rounded-20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Patient Trends</h2>
              <p className="text-[13px] text-text-secondary mt-[2px]">Monthly overview</p>
            </div>
            <div className="flex gap-[6px]">
              {(['3M', '6M', 'All'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className={cn('px-3 py-[5px] rounded-[8px] text-xs font-medium cursor-pointer font-sans transition-all duration-200 border-0', chartPeriod === p ? 'bg-accent-blue text-white' : 'bg-bg-tertiary text-text-secondary')}>
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
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3c83f6]" /><span className="text-xs text-text-secondary">Total Patients</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0ea5e9]" /><span className="text-xs text-text-secondary">Recovered</span></div>
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div variants={item} className="glass-card rounded-20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-text-primary">Recent Patients</h2>
            <button onClick={() => { dispatch(clearFilters()); navigate('/patients'); }}
              className="flex items-center gap-[3px] text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans font-medium">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-[6px]">
            {patients.slice(0, 6).map((patient, i) => (
              <motion.div key={patient.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                onClick={() => dispatch(setSelectedPatient(patient))}
                className="flex items-center gap-[10px] px-[10px] py-[9px] rounded-12 cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary">
                <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>{patient.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{patient.name}</p>
                  <p className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">{patient.diagnosis}</p>
                </div>
                <span className="text-[10px] font-medium px-[7px] py-[3px] rounded-[8px] shrink-0" style={{ background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Discharged',    value: patients.filter(p => p.status === 'Discharged').length, color: 'var(--text-tertiary)',  icon: <UserCheck size={16} />,  desc: 'Patients released' },
          { label: 'Recovering',    value: patients.filter(p => p.status === 'Recovering').length, color: 'var(--accent-yellow)', icon: <Activity size={16} />,   desc: 'In recovery phase' },
          { label: 'Departments',   value: [...new Set(patients.map(p => p.department))].length,   color: '#7c3bed',              icon: <Building2 size={16} />,  desc: 'Active specialties' },
          { label: 'Doctors',       value: [...new Set(patients.map(p => p.doctor))].length,       color: '#3c83f6',              icon: <Users size={16} />,      desc: 'Attending physicians' },
          { label: 'Claim Approval',value: `${approvalRate}%`,                                     color: '#0ea5e9',              icon: <ShieldCheck size={16} />,desc: 'Insurance approved' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-16 p-4">
            <div className="flex items-start justify-between mb-[10px]">
              <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
              <div className="p-[6px] rounded-[8px] shrink-0" style={{ background: `${stat.color}18`, color: stat.color }}>{stat.icon}</div>
            </div>
            <p className="text-[28px] font-bold leading-none" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[11px] text-text-tertiary mt-[6px]">{stat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Today's Appointments */}
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="flex items-center gap-[10px] mb-5">
          <Calendar size={16} className="text-[#3c83f6]" />
          <h3 className="text-[15px] font-semibold text-text-primary">Today's Appointments</h3>
          <span className="text-xs text-text-tertiary">11 May 2026</span>
          <button onClick={() => navigate('/appointments')}
            className="ml-auto flex items-center gap-[3px] text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans font-medium">
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-border-primary">
                {['Time', 'Patient', 'Type', 'Doctor', 'Clinic', 'Intake & Insurance', 'Status'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((app, i) => {
                const sc = APPT_STATUS_COLORS[app.status];
                const typeColor = APPT_TYPE_COLORS[app.type] || 'var(--accent-blue)';
                const patient = patients.find(p => p.id === app.patientId);
                return (
                  <motion.tr key={app.id}
                    onClick={() => patient && dispatch(setSelectedPatient(patient))}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className={cn('cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary', i < todayAppointments.length - 1 && 'border-b border-border-primary')}>
                    <td className="px-3 py-3 font-bold text-text-primary whitespace-nowrap">{app.time}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>{app.patientAvatar}</div>
                        <span className="font-medium text-text-primary whitespace-nowrap">{app.patientName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] px-2 py-[2px] rounded-full font-medium whitespace-nowrap" style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}>{app.type}</span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary text-[13px] whitespace-nowrap">{app.doctor}</td>
                    <td className="px-3 py-3 text-text-secondary text-xs max-w-[180px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">{app.clinicName}</p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <span className="text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap" style={{ background: app.intakeComplete ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)', color: app.intakeComplete ? '#0ea5e9' : '#f59e0b' }}>
                          {app.intakeComplete ? '✓ Intake' : '⏳ Intake'}
                        </span>
                        <span className="text-[10px] px-[6px] py-[2px] rounded-[5px] whitespace-nowrap" style={{ background: app.insuranceVerified ? 'rgba(14,165,233,0.1)' : 'rgba(239,68,68,0.1)', color: app.insuranceVerified ? '#0ea5e9' : '#ef4444' }}>
                          {app.insuranceVerified ? '✓ Ins.' : '✗ Ins.'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] font-medium px-2 py-[3px] rounded-[8px] whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>{app.status}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
