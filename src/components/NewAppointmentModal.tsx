import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { AppointmentType, Appointment } from '@/types';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { addToast, addNotification } from '@/features/ui/uiSlice';
import { addAppointment } from '@/features/appointments/appointmentsSlice';

interface Props {
  defaultDate: string;
  onClose: () => void;
}

interface ConflictInfo {
  doctor?: Appointment;
  patient?: Appointment;
}

interface FormState {
  patientId: string;
  doctor: string;
  date: string;
  type: AppointmentType;
  duration: number;
  time: string;
  notes: string;
}

const TSTART = 9 * 60;
const TEND = 18 * 60;
const TDUR = TEND - TSTART;

const SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
];

const TYPES: AppointmentType[] = [
  'New Patient','Follow-up','Emergency','Routine Check',
  'Consultation','Dialysis Review','Insulin Review',
];

const DURATIONS = [15, 30, 45, 60];

function t2m(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function toLeft(min: number): string {
  return `${((min - TSTART) / TDUR * 100).toFixed(2)}%`;
}

function toWidth(dur: number): string {
  return `${(dur / TDUR * 100).toFixed(2)}%`;
}

function minToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '6px',
};

export default function NewAppointmentModal({ defaultDate, onClose }: Props) {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);
  const appointments = useAppSelector(s => s.appointments.appointments);

  const [form, setForm] = useState<FormState>({
    patientId: '', doctor: '', date: defaultDate,
    type: 'Follow-up', duration: 30, time: '', notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [hoveredBlock, setHoveredBlock] = useState<{ x: number; y: number; text: string } | null>(null);

  const up = (k: keyof FormState, v: FormState[keyof FormState]) =>
    setForm(f => ({ ...f, [k]: v }));

  const doctors = [...new Set(appointments.map(a => a.doctor))];
  const docBusy = appointments.filter(a => a.doctor === form.doctor && a.date === form.date);
  const patBusy = appointments.filter(a => a.patientId === form.patientId && a.date === form.date);

  function getConflict(slot: string): ConflictInfo {
    const s = t2m(slot);
    const e = s + form.duration;
    return {
      doctor: docBusy.find(a => { const as2 = t2m(a.time); return s < as2 + a.duration && e > as2; }),
      patient: patBusy.find(a => { const as2 = t2m(a.time); return s < as2 + a.duration && e > as2; }),
    };
  }

  const selConflict = form.time ? getConflict(form.time) : {};
  const hasConflict = !!(selConflict.doctor || selConflict.patient);

  function handleTimelineClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawMin = TSTART + ((e.clientX - rect.left) / rect.width) * TDUR;
    const snapped = Math.round(rawMin / 30) * 30;
    const clamped = Math.max(TSTART, Math.min(TEND - form.duration, snapped));
    up('time', minToTime(clamped));
    setErrors(err => ({ ...err, time: false }));
  }

  function handleSubmit() {
    const errs: Partial<Record<keyof FormState, boolean>> = {};
    if (!form.patientId) errs.patientId = true;
    if (!form.doctor) errs.doctor = true;
    if (!form.time) errs.time = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const pt = patients.find(p => p.id === form.patientId)!;
    const existingDoc = appointments.find(a => a.doctor === form.doctor);
    const existingPat = appointments.find(a => a.patientId === form.patientId);
    const newAppointment: Appointment = {
      id: `A${Date.now()}`,
      patientId: pt.id,
      patientName: pt.name,
      patientAvatar: pt.avatar,
      dob: `01 Jan ${new Date().getFullYear() - pt.age}`,
      phone: pt.phone,
      doctor: form.doctor,
      department: pt.department,
      clinicName: existingDoc?.clinicName ?? form.doctor,
      date: form.date,
      time: form.time,
      duration: form.duration,
      status: 'Pending',
      type: form.type,
      notes: form.notes || undefined,
      intakeComplete: false,
      insuranceVerified: false,
      insuranceProvider: existingPat?.insuranceProvider ?? 'General Insurance',
    };

    dispatch(addAppointment(newAppointment));
    dispatch(addToast({
      message: `Appointment booked for ${pt.name} with ${form.doctor} at ${form.time}`,
      type: 'success',
    }));
    dispatch(addNotification({
      title: 'Appointment Scheduled',
      message: `${pt.name} with ${form.doctor} at ${form.time} on ${form.date}.`,
      type: 'success',
    }));
    onClose();
  }

  function fldStyle(k: keyof FormState): React.CSSProperties {
    return {
      width: '100%',
      background: 'var(--bg-tertiary)',
      border: `1px solid ${errors[k] ? '#ef4444' : 'var(--border-primary)'}`,
      borderRadius: '10px',
      padding: '10px 12px',
      fontSize: '13px',
      color: 'var(--text-primary)',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    };
  }

  function TrackRow({ label, busy, color, colorRgb }: {
    label: string;
    busy: Appointment[];
    color: string;
    colorRgb: string;
  }) {
    return (
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
        <div onClick={handleTimelineClick}
          style={{ position: 'relative', height: '32px', background: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'hidden', cursor: 'crosshair' }}>
          {busy.map(a => (
            <div key={a.id}
              onMouseEnter={e => setHoveredBlock({ x: e.clientX, y: e.clientY, text: `${a.patientName} · ${a.type} · ${a.duration}min` })}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{
                position: 'absolute', top: 0, bottom: 0,
                left: toLeft(t2m(a.time)), width: toWidth(a.duration),
                background: `rgba(${colorRgb},0.35)`, borderLeft: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', paddingLeft: '4px', overflow: 'hidden',
              }}>
              <span style={{ fontSize: '9px', color, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a.patientName.split(' ')[0]}
              </span>
            </div>
          ))}
          {form.time && (
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: toLeft(t2m(form.time)), width: toWidth(form.duration),
              background: hasConflict ? 'rgba(239,68,68,0.5)' : 'rgba(60,131,246,0.5)',
              borderLeft: `2px solid ${hasConflict ? '#ef4444' : '#3c83f6'}`,
              zIndex: 2, transition: 'left 120ms ease',
            }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', duration: 0.35 }}
        style={{ width: '100%', maxWidth: '680px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>New Appointment</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Schedule a visit and check for conflicts</p>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

          {/* Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Patient <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={form.patientId}
                onChange={e => { up('patientId', e.target.value); setErrors(err => ({ ...err, patientId: false })); }}
                style={fldStyle('patientId')}>
                <option value="">Select patient…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Doctor <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={form.doctor}
                onChange={e => { up('doctor', e.target.value); setErrors(err => ({ ...err, doctor: false })); }}
                style={fldStyle('doctor')}>
                <option value="">Select doctor…</option>
                {doctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => up('date', e.target.value)} style={fldStyle('date')} />
            </div>

            <div>
              <label style={labelStyle}>Appointment Type</label>
              <select value={form.type} onChange={e => up('type', e.target.value as AppointmentType)} style={fldStyle('type')}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Duration (min)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => up('duration', d)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, border: `1px solid ${form.duration === d ? 'var(--accent-blue)' : 'var(--border-primary)'}`, background: form.duration === d ? 'rgba(60,131,246,0.15)' : 'var(--bg-tertiary)', color: form.duration === d ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms ease' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea value={form.notes} onChange={e => up('notes', e.target.value)}
                placeholder="Optional clinical notes…" rows={2}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none', lineHeight: 1.5 }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-primary)', marginBottom: '20px' }} />

          {/* Availability */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Pick a Time</h3>
            {errors.time && <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 400 }}>— required</span>}
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '20px' }}>
            {/* Hour labels */}
            <div style={{ position: 'relative', height: '16px', marginBottom: '8px' }}>
              {[9,10,11,12,13,14,15,16,17,18].map(h => (
                <span key={h} style={{ position: 'absolute', left: `${((h * 60 - TSTART) / TDUR * 100).toFixed(1)}%`, transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                  {h}:00
                </span>
              ))}
            </div>

            {form.doctor
              ? <TrackRow label={form.doctor} busy={docBusy} color="#ef4444" colorRgb="239,68,68" />
              : <div style={{ marginBottom: '8px', padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', textAlign: 'center' }}><p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Select a doctor to see their schedule</p></div>
            }

            {form.patientId
              ? <TrackRow label={patients.find(p => p.id === form.patientId)?.name ?? 'Patient'} busy={patBusy} color="#7c3bed" colorRgb="124,59,237" />
              : <div style={{ marginBottom: '8px', padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', textAlign: 'center' }}><p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Select a patient to see their schedule</p></div>
            }

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { bg: 'rgba(239,68,68,0.35)', border: '#ef4444', label: 'Doctor busy' },
                { bg: 'rgba(124,59,237,0.35)', border: '#7c3bed', label: 'Patient busy' },
                { bg: 'rgba(60,131,246,0.5)', border: '#3c83f6', label: 'Your slot' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.bg, borderLeft: `2px solid ${l.border}` }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{l.label}</span>
                </div>
              ))}
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Click timeline to set time</span>
            </div>
          </div>

          {/* Slot picker */}
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Or pick a slot</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SLOTS.map(slot => {
              const c = getConflict(slot);
              const hasC = !!(c.doctor || c.patient);
              const isSel = form.time === slot;
              return (
                <button key={slot}
                  onClick={() => { up('time', slot); setErrors(err => ({ ...err, time: false })); }}
                  style={{
                    padding: '6px 11px', borderRadius: '8px', fontSize: '12px',
                    fontWeight: isSel ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 120ms ease', position: 'relative',
                    border: isSel ? `2px solid ${hasC ? '#ef4444' : '#3c83f6'}` : '1px solid var(--border-primary)',
                    background: isSel ? (hasC ? 'rgba(239,68,68,0.15)' : 'rgba(60,131,246,0.15)') : hasC ? 'rgba(239,68,68,0.06)' : 'var(--bg-tertiary)',
                    color: isSel ? (hasC ? '#ef4444' : '#3c83f6') : hasC ? '#ef4444' : 'var(--text-secondary)',
                  }}>
                  {slot}
                  {hasC && <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '1.5px solid var(--bg-secondary)' }} />}
                </button>
              );
            })}
          </div>

          {/* Conflict banner */}
          {form.time && hasConflict && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>Conflict at {form.time}</p>
              </div>
              {selConflict.doctor && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '21px', marginBottom: '4px' }}>
                  <strong>{selConflict.doctor.doctor}</strong> has <strong>{selConflict.doctor.patientName}</strong> ({selConflict.doctor.type}, {selConflict.doctor.duration}min) starting at {selConflict.doctor.time}
                </p>
              )}
              {selConflict.patient && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '21px' }}>
                  Patient has <strong>{selConflict.patient.type}</strong> with {selConflict.patient.doctor} at {selConflict.patient.time}
                </p>
              )}
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', paddingLeft: '21px', marginTop: '8px' }}>You can still proceed — conflicts will be flagged.</p>
            </motion.div>
          )}

          {/* All-clear banner */}
          {form.time && !hasConflict && (form.doctor || form.patientId) && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} style={{ color: '#0ea5e9', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 500 }}>{form.time} is available — no conflicts detected</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 500 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={hasConflict}
            style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: hasConflict ? 'var(--bg-tertiary)' : 'var(--gradient-primary)', color: hasConflict ? 'var(--text-tertiary)' : 'white', cursor: hasConflict ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600 }}>
            {hasConflict ? '⛔ Conflicts — Change Time' : 'Book Appointment'}
          </button>
        </div>
      </motion.div>

      {/* Hover tooltip */}
      {hoveredBlock && (
        <div style={{ position: 'fixed', left: hoveredBlock.x + 12, top: hoveredBlock.y - 36, padding: '6px 10px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', fontSize: '12px', color: 'var(--text-primary)', pointerEvents: 'none', zIndex: 70, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', fontFamily: 'Poppins, sans-serif' }}>
          {hoveredBlock.text}
        </div>
      )}
    </motion.div>
  );
}
