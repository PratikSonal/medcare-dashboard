import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { AppointmentType, Appointment } from '@/types';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { addToast, addNotification } from '@/features/ui/uiSlice';
import { addAppointment } from '@/features/appointments/appointmentsSlice';
import { cn } from '@/lib/utils';

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

  const fieldCls = (k: keyof FormState) => cn(
    'w-full bg-bg-tertiary rounded-[10px] py-[10px] px-3 text-[13px] text-text-primary outline-none font-sans box-border transition-colors duration-150 focus:border-accent-blue',
    errors[k] ? 'border border-[#ef4444]' : 'border border-border-primary'
  );

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
    dispatch(addToast({ message: `Appointment booked for ${pt.name} with ${form.doctor} at ${form.time}`, type: 'success' }));
    dispatch(addNotification({ title: 'Appointment Scheduled', message: `${pt.name} with ${form.doctor} at ${form.time} on ${form.date}.`, type: 'success' }));
    onClose();
  }

  function TrackRow({ label, busy, color, colorRgb }: { label: string; busy: Appointment[]; color: string; colorRgb: string }) {
    return (
      <div className="mb-2">
        <p className="text-[10px] text-text-tertiary mb-1">{label}</p>
        <div
          onClick={handleTimelineClick}
          className="relative h-8 bg-bg-tertiary rounded-[8px] overflow-hidden cursor-crosshair"
        >
          {busy.map(a => (
            <div
              key={a.id}
              onMouseEnter={e => setHoveredBlock({ x: e.clientX, y: e.clientY, text: `${a.patientName} · ${a.type} · ${a.duration}min` })}
              onMouseLeave={() => setHoveredBlock(null)}
              className="absolute top-0 bottom-0 flex items-center pl-1 overflow-hidden"
              style={{ left: toLeft(t2m(a.time)), width: toWidth(a.duration), background: `rgba(${colorRgb},0.35)`, borderLeft: `2px solid ${color}` }}
            >
              <span className="text-[9px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color }}>
                {a.patientName.split(' ')[0]}
              </span>
            </div>
          ))}
          {form.time && (
            <div
              className="absolute top-0 bottom-0 z-[2]"
              style={{
                left: toLeft(t2m(form.time)), width: toWidth(form.duration),
                background: hasConflict ? 'rgba(239,68,68,0.5)' : 'rgba(60,131,246,0.5)',
                borderLeft: `2px solid ${hasConflict ? '#ef4444' : '#3c83f6'}`,
                transition: 'left 120ms ease',
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.75)] backdrop-blur-[8px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', duration: 0.35 }}
        className="w-full max-w-[680px] rounded-[24px] bg-bg-secondary border border-border-primary overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="py-[22px] px-6 border-b border-border-primary flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-text-primary">New Appointment</h2>
            <p className="text-[13px] text-text-secondary mt-[2px]">Schedule a visit and check for conflicts</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border-primary bg-bg-tertiary cursor-pointer text-text-secondary">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* Form */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">
                Patient <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={form.patientId}
                onChange={e => { up('patientId', e.target.value); setErrors(err => ({ ...err, patientId: false })); }}
                className={fieldCls('patientId')}
              >
                <option value="">Select patient…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">
                Doctor <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={form.doctor}
                onChange={e => { up('doctor', e.target.value); setErrors(err => ({ ...err, doctor: false })); }}
                className={fieldCls('doctor')}
              >
                <option value="">Select doctor…</option>
                {doctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">Date</label>
              <input type="date" value={form.date} onChange={e => up('date', e.target.value)} className={fieldCls('date')} />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">Appointment Type</label>
              <select value={form.type} onChange={e => up('type', e.target.value as AppointmentType)} className={fieldCls('type')}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">Duration (min)</label>
              <div className="flex gap-[6px]">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => up('duration', d)}
                    className={cn(
                      'flex-1 py-[10px] rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-[120ms]',
                      form.duration === d
                        ? 'border border-accent-blue bg-[rgba(60,131,246,0.15)] text-accent-blue'
                        : 'border border-border-primary bg-bg-tertiary text-text-secondary'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[6px]">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => up('notes', e.target.value)}
                placeholder="Optional clinical notes…"
                rows={2}
                className="w-full bg-bg-tertiary border border-border-primary rounded-[10px] py-[10px] px-3 text-[13px] text-text-primary outline-none font-sans box-border resize-none leading-[1.5] focus:border-accent-blue transition-colors duration-150"
              />
            </div>
          </div>

          <div className="border-t border-border-primary mb-5" />

          {/* Availability */}
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-accent-cyan shrink-0" />
            <h3 className="text-sm font-semibold text-text-primary">Pick a Time</h3>
            {errors.time && <span className="text-xs text-[#ef4444] font-normal">— required</span>}
          </div>

          {/* Timeline */}
          <div className="mb-5">
            <div className="relative h-4 mb-2">
              {[9,10,11,12,13,14,15,16,17,18].map(h => (
                <span
                  key={h}
                  className="absolute text-[10px] text-text-tertiary whitespace-nowrap -translate-x-1/2"
                  style={{ left: `${((h * 60 - TSTART) / TDUR * 100).toFixed(1)}%` }}
                >
                  {h}:00
                </span>
              ))}
            </div>

            {form.doctor
              ? <TrackRow label={form.doctor} busy={docBusy} color="#ef4444" colorRgb="239,68,68" />
              : <div className="mb-2 py-[10px] px-3 rounded-[8px] bg-bg-tertiary text-center"><p className="text-xs text-text-tertiary">Select a doctor to see their schedule</p></div>
            }

            {form.patientId
              ? <TrackRow label={patients.find(p => p.id === form.patientId)?.name ?? 'Patient'} busy={patBusy} color="#7c3bed" colorRgb="124,59,237" />
              : <div className="mb-2 py-[10px] px-3 rounded-[8px] bg-bg-tertiary text-center"><p className="text-xs text-text-tertiary">Select a patient to see their schedule</p></div>
            }

            <div className="flex gap-4 mt-1 flex-wrap items-center">
              {[
                { bg: 'rgba(239,68,68,0.35)',  border: '#ef4444', label: 'Doctor busy' },
                { bg: 'rgba(124,59,237,0.35)', border: '#7c3bed', label: 'Patient busy' },
                { bg: 'rgba(60,131,246,0.5)',  border: '#3c83f6', label: 'Your slot' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-[5px]">
                  <div className="w-[10px] h-[10px] rounded-[2px]" style={{ background: l.bg, borderLeft: `2px solid ${l.border}` }} />
                  <span className="text-[10px] text-text-tertiary">{l.label}</span>
                </div>
              ))}
              <span className="text-[10px] text-text-tertiary ml-auto">Click timeline to set time</span>
            </div>
          </div>

          {/* Slot picker */}
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[10px]">Or pick a slot</p>
          <div className="flex flex-wrap gap-[6px]">
            {SLOTS.map(slot => {
              const c = getConflict(slot);
              const hasC = !!(c.doctor || c.patient);
              const isSel = form.time === slot;
              return (
                <button
                  key={slot}
                  onClick={() => { up('time', slot); setErrors(err => ({ ...err, time: false })); }}
                  className={cn(
                    'py-[6px] px-[11px] rounded-[8px] text-xs cursor-pointer font-sans transition-all duration-[120ms] relative',
                    isSel
                      ? hasC ? 'border-2 border-[#ef4444] bg-[rgba(239,68,68,0.15)] text-[#ef4444] font-semibold'
                              : 'border-2 border-[#3c83f6] bg-[rgba(60,131,246,0.15)] text-[#3c83f6] font-semibold'
                      : hasC ? 'border border-border-primary bg-[rgba(239,68,68,0.06)] text-[#ef4444]'
                              : 'border border-border-primary bg-bg-tertiary text-text-secondary'
                  )}
                >
                  {slot}
                  {hasC && (
                    <span className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-[#ef4444] border-[1.5px] border-bg-secondary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Conflict banner */}
          {form.time && hasConflict && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-[14px] p-[14px] rounded-[12px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)]"
            >
              <div className="flex items-center gap-[7px] mb-2">
                <AlertTriangle size={14} className="text-[#ef4444] shrink-0" />
                <p className="text-[13px] font-semibold text-[#ef4444]">Conflict at {form.time}</p>
              </div>
              {selConflict.doctor && (
                <p className="text-xs text-text-secondary pl-[21px] mb-1">
                  <strong>{selConflict.doctor.doctor}</strong> has <strong>{selConflict.doctor.patientName}</strong> ({selConflict.doctor.type}, {selConflict.doctor.duration}min) starting at {selConflict.doctor.time}
                </p>
              )}
              {selConflict.patient && (
                <p className="text-xs text-text-secondary pl-[21px]">
                  Patient has <strong>{selConflict.patient.type}</strong> with {selConflict.patient.doctor} at {selConflict.patient.time}
                </p>
              )}
              <p className="text-[11px] text-text-tertiary pl-[21px] mt-2">You can still proceed — conflicts will be flagged.</p>
            </motion.div>
          )}

          {/* All-clear banner */}
          {form.time && !hasConflict && (form.doctor || form.patientId) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-[14px] py-3 px-[14px] rounded-[12px] bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.2)] flex items-center gap-2"
            >
              <CheckCircle2 size={14} className="text-[#0ea5e9] shrink-0" />
              <p className="text-xs text-[#0ea5e9] font-medium">{form.time} is available — no conflicts detected</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="py-4 px-6 border-t border-border-primary flex gap-[10px] shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-[12px] border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={hasConflict}
            className="flex-[2] py-3 rounded-[12px] border-0 cursor-pointer font-sans text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              background: hasConflict ? 'var(--bg-tertiary)' : 'var(--gradient-primary)',
              color: hasConflict ? 'var(--text-tertiary)' : 'white',
            }}
          >
            {hasConflict ? '⛔ Conflicts — Change Time' : 'Book Appointment'}
          </button>
        </div>
      </motion.div>

      {/* Hover tooltip */}
      {hoveredBlock && (
        <div
          className="fixed py-[6px] px-[10px] rounded-[8px] bg-bg-card border border-border-primary text-xs text-text-primary pointer-events-none z-[70] whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.25)] font-sans"
          style={{ left: hoveredBlock.x + 12, top: hoveredBlock.y - 36 }}
        >
          {hoveredBlock.text}
        </div>
      )}
    </motion.div>
  );
}
