import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, Plus, Filter, Phone, Search, X, UserX, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { AppointmentStatus, Appointment } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';
import { updateAppointmentStatus, updateAppointmentChecks } from '@/features/appointments/appointmentsSlice';
import NewAppointmentModal from '@/components/NewAppointmentModal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Confirmed: { color: '#3c83f6', bg: 'rgba(60,131,246,0.1)', icon: <CheckCircle size={13} />, label: 'Confirmed' },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <AlertCircle size={13} />, label: 'Pending' },
  Completed: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: <CheckCircle size={13} />, label: 'Completed' },
  Cancelled: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: <XCircle size={13} />, label: 'Cancelled' },
  'No-Show': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={13} />, label: 'No-Show' },
};

const TYPE_COLORS: Record<string, string> = {
  Emergency: '#ef4444',
  'New Patient': '#7c3bed',
  'Follow-up': '#3c83f6',
  'Routine Check': '#0ea5e9',
  Consultation: '#f59e0b',
  'Dialysis Review': '#38bdf8',
  'Insulin Review': '#0ea5e9',
};

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
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);
  const appointments = useAppSelector(s => s.appointments.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-05-11'));
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);

  const baseDate = new Date('2026-05-11');
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(baseDate);

  const dateKey = formatDateKey(selectedDate);
  const todayApps = appointments.filter(a => {
    if (a.date !== dateKey) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (filterType !== 'All' && a.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.patientName.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.clinicName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.insuranceProvider.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));
  const hasActiveFilters = filterStatus !== 'All' || filterType !== 'All';
  const clearFilters = () => { setFilterStatus('All'); setFilterType('All'); };
  const todayAll = appointments.filter(a => a.date === dateKey).sort((a, b) => a.time.localeCompare(b.time));
  const doctors = [...new Set(appointments.map(a => a.doctor))];

  const allStatuses: AppointmentStatus[] = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'No-Show'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const stats = [
    { label: 'Total Today',  value: todayAll.length,                                          color: '#3c83f6', icon: <Calendar size={16} />,     desc: 'All scheduled visits',    filter: 'All'       },
    { label: 'Confirmed',    value: todayAll.filter(a => a.status === 'Confirmed').length,    color: '#0ea5e9', icon: <CheckCircle size={16} />,  desc: 'Ready to proceed',        filter: 'Confirmed' },
    { label: 'Pending',      value: todayAll.filter(a => a.status === 'Pending').length,      color: '#f59e0b', icon: <AlertCircle size={16} />,  desc: 'Awaiting confirmation',   filter: 'Pending'   },
    { label: 'No-Shows',     value: todayAll.filter(a => a.status === 'No-Show').length,      color: '#ef4444', icon: <XCircle size={16} />,      desc: 'Did not attend',          filter: 'No-Show'   },
  ];

  const handleViewPatient = () => {
    if (!selectedApp) return;
    const patient = patients.find(p => p.id === selectedApp.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    setSelectedApp(null);
  };

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
          <Button onClick={() => setShowNewAppModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--gradient-primary)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
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
            onClick={() => setFilterStatus(s.filter)}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="glass-card"
            style={{ borderRadius: '16px', padding: '18px', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: filterStatus === s.filter ? `1px solid ${s.color}50` : undefined }}>
            <div style={{ position: 'absolute', inset: 0, opacity: filterStatus === s.filter ? 0.07 : 0.03, background: `radial-gradient(circle at top right, ${s.color}, transparent)`, pointerEvents: 'none', transition: 'opacity 200ms ease' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>{s.label}</p>
              <div style={{ padding: '6px', borderRadius: '8px', background: `${s.color}18`, color: s.color, flexShrink: 0 }}>{s.icon}</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>{s.desc}</p>
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
                const appCount = appointments.filter(a => a.date === key).length;
                return (
                  <motion.button key={key} onClick={() => setSelectedDate(day)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 8px', borderRadius: '14px', border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent', background: isSelected ? 'rgba(60,131,246,0.15)' : 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 200ms ease', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: '11px', color: isSelected ? 'var(--accent-blue)' : 'var(--text-tertiary)', fontWeight: 500 }}>{dayNames[i]}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{day.getDate()}</span>
                    {appCount > 0 && (
                      <span style={{ fontSize: '9px', fontWeight: 700, lineHeight: 1, padding: '2px 5px', borderRadius: '99px', color: 'white', background: isSelected ? '#3c83f6' : appCount >= 6 ? '#ef4444' : appCount >= 4 ? '#f59e0b' : '#0ea5e9' }}>
                        {appCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Search + Filter bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by patient, doctor, type, clinic, insurance…"
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '10px 36px 10px 38px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent-blue)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-primary)')}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '2px' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <button onClick={() => setShowFilters(f => !f)}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, border: `1px solid ${hasActiveFilters ? 'rgba(60,131,246,0.4)' : 'var(--border-primary)'}`, background: hasActiveFilters ? 'rgba(60,131,246,0.1)' : 'var(--bg-secondary)', color: hasActiveFilters ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}>
                <Filter size={14} />
                Filters
                {hasActiveFilters && <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', background: 'var(--accent-blue)', color: 'white' }}>ON</span>}
                <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: showFilters ? 'rotate(180deg)' : 'none' }} />
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, marginTop: 0 }}
                  animate={{ opacity: 1, maxHeight: 200, marginTop: 10 }}
                  exit={{ opacity: 0, maxHeight: 0, marginTop: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="glass-card"
                  style={{ borderRadius: '16px', padding: '20px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Status</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['All', ...allStatuses].map(s => (
                          <button key={s} onClick={() => setFilterStatus(s)}
                            style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms ease', background: filterStatus === s ? 'var(--accent-blue)' : 'var(--bg-tertiary)', color: filterStatus === s ? 'white' : 'var(--text-secondary)', border: 'none' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Appointment Type</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['All', ...Object.keys(TYPE_COLORS)].map(t => (
                          <button key={t} onClick={() => setFilterType(t)}
                            style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms ease', background: filterType === t ? (TYPE_COLORS[t] ?? 'var(--accent-blue)') : 'var(--bg-tertiary)', color: filterType === t ? 'white' : 'var(--text-secondary)', border: 'none' }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                        <div style={{ textAlign: 'center', minWidth: '48px' }}>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{app.time}</p>
                          <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{app.duration}min</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-primary)', flexShrink: 0 }} />
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>{app.patientAvatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.patientName}</p>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, fontWeight: 500 }}>{app.type}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{app.doctor} · {app.department}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            <Phone size={10} style={{ color: 'var(--text-tertiary)' }} />
                            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{app.phone}</p>
                          </div>
                          {app.notes && <p style={{ fontSize: '11px', color: 'var(--accent-yellow)', marginTop: '4px' }}>⚠️ {app.notes}</p>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '8px', background: status.bg, color: status.color }}>
                          {status.icon} {status.label}
                        </span>
                        {(app.status === 'Pending' || app.status === 'Confirmed') && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {app.status === 'Pending' && (
                              <button onClick={e => { e.stopPropagation(); dispatch(updateAppointmentStatus({ id: app.id, status: 'Confirmed' })); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, border: '1px solid rgba(14,165,233,0.35)', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <CheckCircle size={10} /> Confirm
                              </button>
                            )}
                            <button onClick={e => { e.stopPropagation(); dispatch(updateAppointmentStatus({ id: app.id, status: 'No-Show' })); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, border: '1px solid rgba(107,114,128,0.3)', background: 'rgba(107,114,128,0.08)', color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                              <UserX size={10} /> No-show
                            </button>
                            <button onClick={e => { e.stopPropagation(); dispatch(updateAppointmentStatus({ id: app.id, status: 'Cancelled' })); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                              <XCircle size={10} /> Cancel
                            </button>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.intakeComplete ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)', color: app.intakeComplete ? '#0ea5e9' : '#f59e0b', border: `1px solid ${app.intakeComplete ? 'rgba(14,165,233,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                            {app.intakeComplete ? '✓ Intake' : '⏳ Intake'}
                          </span>
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.insuranceVerified ? 'rgba(14,165,233,0.1)' : 'rgba(239,68,68,0.1)', color: app.insuranceVerified ? '#0ea5e9' : '#ef4444', border: `1px solid ${app.insuranceVerified ? 'rgba(14,165,233,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
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

        {/* Right sidebar */}
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
                        <div style={{ height: '100%', width: `${docApps.length > 0 ? (confirmed / docApps.length) * 100 : 0}%`, background: 'var(--accent-blue)', borderRadius: '2px', transition: 'width 600ms ease' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{confirmed}/{docApps.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Action Required */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Action Required</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayAll.filter(a => !a.intakeComplete || !a.insuranceVerified).map(app => (
                <div key={app.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{app.patientAvatar}</div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.patientName}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{app.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {!app.intakeComplete && (
                      <button onClick={() => dispatch(updateAppointmentChecks({ id: app.id, intakeComplete: true }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <ClipboardCheck size={10} /> Complete Intake
                      </button>
                    )}
                    {!app.insuranceVerified && (
                      <button onClick={() => dispatch(updateAppointmentChecks({ id: app.id, insuranceVerified: true }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <ShieldCheck size={10} /> Verify Insurance
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {todayAll.filter(a => !a.intakeComplete || !a.insuranceVerified).length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>All clear for today</p>
              )}
            </div>
          </motion.div>

          {/* Time Slots */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card" style={{ borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} style={{ color: 'var(--accent-cyan)' }} /> Time Slots
            </h3>
            {todayAll.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '12px 0' }}>No appointments today</p>
            ) : todayAll.map((app, i) => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < todayAll.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', width: '40px', flexShrink: 0 }}>{app.time}</span>
                <div style={{ flex: 1, padding: '4px 10px', borderRadius: '8px', background: STATUS_CONFIG[app.status].bg, fontSize: '11px', color: STATUS_CONFIG[app.status].color, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {app.patientName}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNewAppModal && (
          <NewAppointmentModal
            defaultDate={formatDateKey(selectedDate)}
            onClose={() => setShowNewAppModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedApp(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              style={{ width: '100%', maxWidth: '520px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div style={{ padding: '24px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)' }}>{selectedApp.patientAvatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedApp.patientName}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>DOB: {selectedApp.dob}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Phone size={11} /> {selectedApp.phone}
                      </span>
                    </div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '10px', background: STATUS_CONFIG[selectedApp.status].bg, color: STATUS_CONFIG[selectedApp.status].color, flexShrink: 0 }}>
                    {STATUS_CONFIG[selectedApp.status].icon} {selectedApp.status}
                  </span>
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Appointment details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Date', value: new Date(selectedApp.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) },
                    { label: 'Time', value: `${selectedApp.time} (${selectedApp.duration} min)` },
                    { label: 'Doctor', value: selectedApp.doctor },
                    { label: 'Visit Type', value: selectedApp.type },
                    { label: 'Clinic', value: selectedApp.clinicName },
                    { label: 'Insurance Provider', value: selectedApp.insuranceProvider },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Intake & Insurance */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '14px', textAlign: 'center', background: selectedApp.intakeComplete ? 'rgba(14,165,233,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${selectedApp.intakeComplete ? 'rgba(14,165,233,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                    <p style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedApp.intakeComplete ? '✅' : '⏳'}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: selectedApp.intakeComplete ? '#0ea5e9' : '#f59e0b' }}>Patient Intake</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{selectedApp.intakeComplete ? 'Complete' : 'Pending'}</p>
                  </div>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '14px', textAlign: 'center', background: selectedApp.insuranceVerified ? 'rgba(14,165,233,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selectedApp.insuranceVerified ? 'rgba(14,165,233,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    <p style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedApp.insuranceVerified ? '✅' : '❌'}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: selectedApp.insuranceVerified ? '#0ea5e9' : '#ef4444' }}>Insurance</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{selectedApp.insuranceVerified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                </div>

                {/* Doctor notes */}
                {selectedApp.notes && (
                  <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '6px' }}>⚠️ Doctor Notes</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedApp.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setSelectedApp(null)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 500 }}>
                    Close
                  </button>
                  <button onClick={handleViewPatient}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--gradient-primary)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600 }}>
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
