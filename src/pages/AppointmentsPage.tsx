import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { mockPatients } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

type AppStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'No-Show';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: AppStatus;
  type: string;
  notes?: string;
  intakeComplete: boolean;
  insuranceVerified: boolean;
}

// Mock appointment data
const mockAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'Aarav Mehta', patientAvatar: 'AM', doctor: 'Dr. Priya Sharma', department: 'Endocrinology', date: '2026-05-11', time: '09:00', duration: 30, status: 'Confirmed', type: 'Follow-up', intakeComplete: true, insuranceVerified: true },
  { id: 'A002', patientId: 'P003', patientName: 'Rohan Verma', patientAvatar: 'RV', doctor: 'Dr. Sneha Iyer', department: 'Cardiology', date: '2026-05-11', time: '09:30', duration: 60, status: 'Confirmed', type: 'Emergency', notes: 'Critical — ICU follow-up', intakeComplete: true, insuranceVerified: false },
  { id: 'A003', patientId: 'P004', patientName: 'Nisha Patel', patientAvatar: 'NP', doctor: 'Dr. Vikram Rao', department: 'Neurology', date: '2026-05-11', time: '10:00', duration: 30, status: 'Pending', type: 'New Patient', intakeComplete: false, insuranceVerified: true },
  { id: 'A004', patientId: 'P008', patientName: 'Priya Sharma', patientAvatar: 'PS', doctor: 'Dr. Arjun Nair', department: 'Internal Medicine', date: '2026-05-11', time: '11:00', duration: 30, status: 'Completed', type: 'Follow-up', intakeComplete: true, insuranceVerified: true },
  { id: 'A005', patientId: 'P005', patientName: 'Karan Singh', patientAvatar: 'KS', doctor: 'Dr. Sneha Iyer', department: 'Cardiology', date: '2026-05-11', time: '11:30', duration: 45, status: 'No-Show', type: 'Routine Check', intakeComplete: true, insuranceVerified: true },
  { id: 'A006', patientId: 'P010', patientName: 'Meera Iyer', patientAvatar: 'MI', doctor: 'Dr. Priya Sharma', department: 'Endocrinology', date: '2026-05-11', time: '14:00', duration: 30, status: 'Confirmed', type: 'Follow-up', intakeComplete: true, insuranceVerified: true },
  { id: 'A007', patientId: 'P016', patientName: 'Lakshmi Naidu', patientAvatar: 'LN', doctor: 'Dr. Vikram Rao', department: 'Neurology', date: '2026-05-11', time: '14:30', duration: 60, status: 'Confirmed', type: 'Emergency', notes: 'Stroke patient — high priority', intakeComplete: false, insuranceVerified: false },
  { id: 'A008', patientId: 'P011', patientName: 'Rahul Bose', patientAvatar: 'RB', doctor: 'Dr. Vikram Rao', department: 'Orthopedics', date: '2026-05-11', time: '15:00', duration: 30, status: 'Pending', type: 'Consultation', intakeComplete: false, insuranceVerified: true },
  { id: 'A009', patientId: 'P002', patientName: 'Sanya Kapoor', patientAvatar: 'SK', doctor: 'Dr. Arjun Nair', department: 'Pulmonology', date: '2026-05-12', time: '09:00', duration: 30, status: 'Confirmed', type: 'Follow-up', intakeComplete: true, insuranceVerified: true },
  { id: 'A010', patientId: 'P007', patientName: 'Vikram Nair', patientAvatar: 'VN', doctor: 'Dr. Meera Pillai', department: 'Nephrology', date: '2026-05-12', time: '10:00', duration: 45, status: 'Confirmed', type: 'Dialysis Review', intakeComplete: true, insuranceVerified: false },
  { id: 'A011', patientId: 'P014', patientName: 'Kavitha Rajan', patientAvatar: 'KR', doctor: 'Dr. Sneha Iyer', department: 'Rheumatology', date: '2026-05-12', time: '11:00', duration: 30, status: 'Pending', type: 'Follow-up', intakeComplete: false, insuranceVerified: true },
  { id: 'A012', patientId: 'P020', patientName: 'Sunita Agarwal', patientAvatar: 'SA', doctor: 'Dr. Priya Sharma', department: 'Endocrinology', date: '2026-05-13', time: '09:30', duration: 30, status: 'Confirmed', type: 'Insulin Review', intakeComplete: true, insuranceVerified: true },
];

const STATUS_CONFIG: Record<AppStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Confirmed: { color: '#3c83f6', bg: 'rgba(60,131,246,0.1)', icon: <CheckCircle size={13} />, label: 'Confirmed' },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <AlertCircle size={13} />, label: 'Pending' },
  Completed: { color: '#10bc83', bg: 'rgba(16,188,131,0.1)', icon: <CheckCircle size={13} />, label: 'Completed' },
  Cancelled: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: <XCircle size={13} />, label: 'Cancelled' },
  'No-Show': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={13} />, label: 'No-Show' },
};

const TYPE_COLORS: Record<string, string> = {
  'Emergency': '#ef4444',
  'New Patient': '#7c3bed',
  'Follow-up': '#3c83f6',
  'Routine Check': '#10bc83',
  'Consultation': '#f59e0b',
  'Dialysis Review': '#0da2e7',
  'Insulin Review': '#10bc83',
};

// Week days for calendar strip
function getWeekDays(baseDate: Date) {
  const days = [];
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateKey(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-05-11'));
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);

  const baseDate = new Date('2026-05-11');
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(baseDate);

  const dateKey = formatDateKey(selectedDate);
  const todayApps = mockAppointments.filter(a => a.date === dateKey && (filterStatus === 'All' || a.status === filterStatus));

  const allStatuses: AppStatus[] = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'No-Show'];
  const doctors = [...new Set(mockPatients.map(p => p.doctor))];

  // Stats for today
  const todayAll = mockAppointments.filter(a => a.date === dateKey);
  const stats = [
    { label: 'Total', value: todayAll.length, color: 'var(--accent-blue)' },
    { label: 'Confirmed', value: todayAll.filter(a => a.status === 'Confirmed').length, color: '#3c83f6' },
    { label: 'Pending', value: todayAll.filter(a => a.status === 'Pending').length, color: '#f59e0b' },
    { label: 'No-Shows', value: todayAll.filter(a => a.status === 'No-Show').length, color: '#ef4444' },
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Appointments</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {todayApps.length} appointments on {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <Button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--gradient-primary)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
            <Plus size={16} /> New Appointment
          </Button>
        </div>
        <div className="glow-line" style={{ marginTop: '20px' }} />
      </motion.div>

      {/* Daily Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            className="glass-card" style={{ borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        {/* Left — Calendar + List */}
        <div>
          {/* Week strip */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {baseDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setWeekOffset(w => w - 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => setWeekOffset(w => w + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {weekDays.map((day, i) => {
                const key = formatDateKey(day);
                const isSelected = key === formatDateKey(selectedDate);
                const appCount = mockAppointments.filter(a => a.date === key).length;
                return (
                  <motion.button key={key} onClick={() => setSelectedDate(day)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 8px', borderRadius: '14px', border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent', background: isSelected ? 'rgba(60,131,246,0.15)' : 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 200ms ease', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: '11px', color: isSelected ? 'var(--accent-blue)' : 'var(--text-tertiary)', fontWeight: 500 }}>{dayNames[i]}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{day.getDate()}</span>
                    {appCount > 0 && (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? 'var(--accent-blue)' : 'var(--accent-green)' }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
            {['All', ...allStatuses].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: filterStatus === s ? 'var(--accent-blue)' : 'var(--bg-secondary)', color: filterStatus === s ? 'white' : 'var(--text-secondary)', border: filterStatus === s ? 'none' : '1px solid var(--border-primary)' } as React.CSSProperties}>
                {s}
              </button>
            ))}
          </div>

          {/* Appointment list */}
          <AnimatePresence mode="wait">
            <motion.div key={dateKey + filterStatus} variants={container} initial="hidden" animate="show"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayApps.length === 0 ? (
                <motion.div variants={item} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                  <Calendar size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: '15px', fontWeight: 500 }}>No appointments for this day</p>
                </motion.div>
              ) : todayApps.map(app => {
                const status = STATUS_CONFIG[app.status];
                const typeColor = TYPE_COLORS[app.type] || 'var(--accent-blue)';
                return (
                  <motion.div key={app.id} variants={item}
                    onClick={() => setSelectedApp(app)}
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                    className="glass-card"
                    style={{ borderRadius: '16px', padding: '16px', cursor: 'pointer', borderLeft: `3px solid ${typeColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {/* Time */}
                        <div style={{ textAlign: 'center', minWidth: '48px' }}>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{app.time}</p>
                          <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{app.duration}min</p>
                        </div>
                        {/* Divider */}
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-primary)', flexShrink: 0 }} />
                        {/* Avatar + Info */}
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>{app.patientAvatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.patientName}</p>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, fontWeight: 500 }}>{app.type}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{app.doctor} · {app.department}</p>
                          {app.notes && <p style={{ fontSize: '11px', color: 'var(--accent-yellow)', marginTop: '4px' }}>⚠️ {app.notes}</p>}
                        </div>
                      </div>
                      {/* Right side */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '8px', background: status.bg, color: status.color }}>
                          {status.icon} {status.label}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.intakeComplete ? 'rgba(16,188,131,0.1)' : 'rgba(245,158,11,0.1)', color: app.intakeComplete ? '#10bc83' : '#f59e0b', border: `1px solid ${app.intakeComplete ? 'rgba(16,188,131,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                            {app.intakeComplete ? '✓ Intake' : '⏳ Intake'}
                          </span>
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.insuranceVerified ? 'rgba(16,188,131,0.1)' : 'rgba(239,68,68,0.1)', color: app.insuranceVerified ? '#10bc83' : '#ef4444', border: `1px solid ${app.insuranceVerified ? 'rgba(16,188,131,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                            {app.insuranceVerified ? '✓ Insured' : '✗ Insurance'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — Doctor sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Doctor schedules */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={15} style={{ color: 'var(--accent-blue)' }} /> Doctor Schedules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {doctors.map(doc => {
                const docApps = todayAll.filter(a => a.doctor === doc);
                const confirmed = docApps.filter(a => a.status === 'Confirmed').length;
                return (
                  <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>
                        {doc.split(' ').slice(-1)[0][0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{doc.replace('Dr. ', '')}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{docApps.length} today</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'var(--border-primary)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${docApps.length > 0 ? (confirmed / docApps.length) * 100 : 0}%`, background: 'var(--accent-green)', borderRadius: '2px', transition: 'width 600ms ease' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{confirmed}/{docApps.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Intake & Insurance alerts */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Action Required</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayAll.filter(a => !a.intakeComplete || !a.insuranceVerified).map(app => (
                <div key={app.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{app.patientAvatar}</div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.patientName}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{app.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {!app.intakeComplete && <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>⏳ Intake Pending</span>}
                    {!app.insuranceVerified && <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>✗ Insurance Unverified</span>}
                  </div>
                </div>
              ))}
              {todayAll.filter(a => !a.intakeComplete || !a.insuranceVerified).length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>✅ All clear for today!</p>
              )}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} style={{ color: 'var(--accent-green)' }} /> Time Slots
            </h3>
            {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(slot => {
              const app = todayAll.find(a => a.time === slot);
              return (
                <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', width: '40px', flexShrink: 0 }}>{slot}</span>
                  {app ? (
                    <div style={{ flex: 1, padding: '4px 10px', borderRadius: '8px', background: `${STATUS_CONFIG[app.status].bg}`, fontSize: '11px', color: STATUS_CONFIG[app.status].color, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.patientName}
                    </div>
                  ) : (
                    <div style={{ flex: 1, padding: '4px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', fontSize: '11px', color: 'var(--text-tertiary)' }}>Available</div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedApp(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div style={{ padding: '24px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)' }}>{selectedApp.patientAvatar}</div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedApp.patientName}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedApp.type} · {selectedApp.department}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '10px', background: STATUS_CONFIG[selectedApp.status].bg, color: STATUS_CONFIG[selectedApp.status].color }}>
                    {STATUS_CONFIG[selectedApp.status].icon} {selectedApp.status}
                  </span>
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Date', value: new Date(selectedApp.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) },
                    { label: 'Time', value: `${selectedApp.time} (${selectedApp.duration} min)` },
                    { label: 'Doctor', value: selectedApp.doctor },
                    { label: 'Appointment ID', value: selectedApp.id },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
                {/* Status indicators */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '14px', textAlign: 'center', background: selectedApp.intakeComplete ? 'rgba(16,188,131,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${selectedApp.intakeComplete ? 'rgba(16,188,131,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                    <p style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedApp.intakeComplete ? '✅' : '⏳'}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: selectedApp.intakeComplete ? '#10bc83' : '#f59e0b' }}>Patient Intake</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{selectedApp.intakeComplete ? 'Complete' : 'Pending'}</p>
                  </div>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '14px', textAlign: 'center', background: selectedApp.insuranceVerified ? 'rgba(16,188,131,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selectedApp.insuranceVerified ? 'rgba(16,188,131,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    <p style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedApp.insuranceVerified ? '✅' : '❌'}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: selectedApp.insuranceVerified ? '#10bc83' : '#ef4444' }}>Insurance</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{selectedApp.insuranceVerified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                </div>
                {selectedApp.notes && (
                  <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>⚠️ Clinical Note</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedApp.notes}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setSelectedApp(null)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 500 }}>
                    Close
                  </button>
                  <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--gradient-primary)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600 }}>
                    View Patient
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
