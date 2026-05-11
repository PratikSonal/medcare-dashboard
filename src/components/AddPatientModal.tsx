import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Stethoscope, Activity, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addPatient } from '@/features/patients/patientsSlice';
import { addToast } from '@/features/ui/uiSlice';
import type { Patient, PatientStatus, BloodGroup } from '@/types';

const DEPARTMENTS = ['Cardiology', 'Neurology', 'Pulmonology', 'Endocrinology', 'Orthopedics', 'Surgery', 'Nephrology', 'Internal Medicine', 'Gastroenterology', 'Rheumatology'];
const DOCTORS = ['Dr. Priya Sharma', 'Dr. Arjun Nair', 'Dr. Sneha Iyer', 'Dr. Vikram Rao', 'Dr. Rahul Gupta', 'Dr. Meera Pillai'];
const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES: PatientStatus[] = ['Active', 'Critical', 'Recovering', 'Discharged'];

const STATUS_COLORS: Record<PatientStatus, string> = {
  Active: '#0ea5e9',
  Critical: '#ef4444',
  Recovering: '#f59e0b',
  Discharged: 'var(--text-tertiary)',
};

const STEPS = [
  { label: 'Personal', icon: User },
  { label: 'Medical', icon: Stethoscope },
  { label: 'Vitals', icon: Activity },
];

type FormData = {
  name: string; age: string; gender: 'Male' | 'Female' | 'Other'; bloodGroup: BloodGroup;
  phone: string; email: string; address: string;
  status: PatientStatus; diagnosis: string; department: string; doctor: string;
  admissionDate: string; tags: string;
  heartRate: string; bloodPressure: string; temperature: string; oxygenSat: string; weight: string;
};

const defaultForm: FormData = {
  name: '', age: '', gender: 'Male', bloodGroup: 'A+',
  phone: '', email: '', address: '',
  status: 'Active', diagnosis: '', department: 'Cardiology', doctor: 'Dr. Priya Sharma',
  admissionDate: new Date().toISOString().split('T')[0], tags: '',
  heartRate: '', bloodPressure: '', temperature: '', oxygenSat: '', weight: '',
};

function Field({ label, error, children }: { label: string; error?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 600, color: error ? '#ef4444' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
        {label}{error && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export function AddPatientModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const inp = (field: keyof FormData): React.CSSProperties => ({
    width: '100%',
    background: 'var(--bg-secondary)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'var(--border-primary)'}`,
    borderRadius: '10px',
    padding: '9px 12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: false }));
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>, field: keyof FormData) => {
    if (!errors[field]) e.target.style.borderColor = 'var(--accent-blue)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>, field: keyof FormData) => {
    if (!errors[field]) e.target.style.borderColor = 'var(--border-primary)';
  };

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = true;
      if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) e.age = true;
      if (!form.phone.trim()) e.phone = true;
    } else if (s === 1) {
      if (!form.diagnosis.trim()) e.diagnosis = true;
    } else {
      if (!form.heartRate || isNaN(Number(form.heartRate))) e.heartRate = true;
      if (!form.bloodPressure.trim()) e.bloodPressure = true;
      if (!form.temperature || isNaN(Number(form.temperature))) e.temperature = true;
      if (!form.oxygenSat || isNaN(Number(form.oxygenSat))) e.oxygenSat = true;
      if (!form.weight || isNaN(Number(form.weight))) e.weight = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = () => {
    if (!validate(2)) return;
    const maxId = Math.max(...patients.map(p => parseInt(p.id.slice(1))));
    const newId = `P${String(maxId + 1).padStart(3, '0')}`;
    const initials = form.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const patient: Patient = {
      id: newId, name: form.name.trim(), age: Number(form.age), gender: form.gender,
      bloodGroup: form.bloodGroup, status: form.status, diagnosis: form.diagnosis.trim(),
      department: form.department, doctor: form.doctor, admissionDate: form.admissionDate,
      lastVisit: form.admissionDate, phone: form.phone.trim(), email: form.email.trim(),
      address: form.address.trim(), avatar: initials,
      vitals: {
        heartRate: Number(form.heartRate), bloodPressure: form.bloodPressure.trim(),
        temperature: Number(form.temperature), oxygenSat: Number(form.oxygenSat), weight: Number(form.weight),
      },
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    dispatch(addPatient(patient));
    dispatch(addToast({ message: `${patient.name} added successfully`, type: 'success' }));
    onClose();
  };

  const nextId = `P${String(Math.max(...patients.map(p => parseInt(p.id.slice(1)))) + 1).padStart(3, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-primary)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border-primary)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Add New Patient</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Step {step + 1} of 3 — {STEPS[step].label} Info</p>
            </div>
            <button onClick={onClose} style={{ padding: '6px', borderRadius: '10px', background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > i;
              const active = step === i;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#0ea5e9' : active ? 'rgba(60,131,246,0.12)' : 'var(--bg-tertiary)', border: `2px solid ${done ? '#0ea5e9' : active ? '#3c83f6' : 'var(--border-primary)'}`, transition: 'all 250ms ease' }}>
                      {done ? <Check size={14} color="white" strokeWidth={3} /> : <Icon size={14} color={active ? '#3c83f6' : 'var(--text-tertiary)'} />}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: active ? '#3c83f6' : done ? '#0ea5e9' : 'var(--text-tertiary)', letterSpacing: '0.03em' }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', marginBottom: '18px', marginLeft: '6px', marginRight: '6px', background: step > i ? '#0ea5e9' : 'var(--border-primary)', transition: 'background 250ms ease' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Full Name" error={errors.name}>
                  <input value={form.name} onChange={set('name')} placeholder="e.g. Riya Mehta" style={inp('name')}
                    onFocus={e => focusStyle(e, 'name')} onBlur={e => blurStyle(e, 'name')} />
                </Field>
                <div style={grid2}>
                  <Field label="Age" error={errors.age}>
                    <input type="number" min={1} max={120} value={form.age} onChange={set('age')} placeholder="35" style={inp('age')}
                      onFocus={e => focusStyle(e, 'age')} onBlur={e => blurStyle(e, 'age')} />
                  </Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={set('gender')} style={inp('gender')}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </Field>
                </div>
                <div style={grid2}>
                  <Field label="Blood Group">
                    <select value={form.bloodGroup} onChange={set('bloodGroup')} style={inp('bloodGroup')}>
                      {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input value={form.phone} onChange={set('phone')} placeholder="+91 98765 12345" style={inp('phone')}
                      onFocus={e => focusStyle(e, 'phone')} onBlur={e => blurStyle(e, 'phone')} />
                  </Field>
                </div>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={set('email')} placeholder="patient@email.com" style={inp('email')}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-primary)'; }} />
                </Field>
                <Field label="Address">
                  <input value={form.address} onChange={set('address')} placeholder="Street, City" style={inp('address')}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-primary)'; }} />
                </Field>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Status">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                        style={{ padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, border: `1px solid ${form.status === s ? STATUS_COLORS[s] : 'var(--border-primary)'}`, background: form.status === s ? `${STATUS_COLORS[s]}18` : 'var(--bg-secondary)', color: form.status === s ? STATUS_COLORS[s] : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms ease' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Diagnosis" error={errors.diagnosis}>
                  <input value={form.diagnosis} onChange={set('diagnosis')} placeholder="e.g. Type 2 Diabetes" style={inp('diagnosis')}
                    onFocus={e => focusStyle(e, 'diagnosis')} onBlur={e => blurStyle(e, 'diagnosis')} />
                </Field>
                <div style={grid2}>
                  <Field label="Department">
                    <select value={form.department} onChange={set('department')} style={inp('department')}>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Attending Doctor">
                    <select value={form.doctor} onChange={set('doctor')} style={inp('doctor')}>
                      {DOCTORS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={grid2}>
                  <Field label="Admission Date">
                    <input type="date" value={form.admissionDate} onChange={set('admissionDate')} style={inp('admissionDate')}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-primary)'; }} />
                  </Field>
                  <Field label="Tags (comma-separated)">
                    <input value={form.tags} onChange={set('tags')} placeholder="Diabetic, High BP" style={inp('tags')}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-primary)'; }} />
                  </Field>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={grid2}>
                  <Field label="Heart Rate (bpm)" error={errors.heartRate}>
                    <input type="number" value={form.heartRate} onChange={set('heartRate')} placeholder="72" style={inp('heartRate')}
                      onFocus={e => focusStyle(e, 'heartRate')} onBlur={e => blurStyle(e, 'heartRate')} />
                  </Field>
                  <Field label="Blood Pressure" error={errors.bloodPressure}>
                    <input value={form.bloodPressure} onChange={set('bloodPressure')} placeholder="120/80" style={inp('bloodPressure')}
                      onFocus={e => focusStyle(e, 'bloodPressure')} onBlur={e => blurStyle(e, 'bloodPressure')} />
                  </Field>
                </div>
                <div style={grid2}>
                  <Field label="Temperature (°F)" error={errors.temperature}>
                    <input type="number" step="0.1" value={form.temperature} onChange={set('temperature')} placeholder="98.6" style={inp('temperature')}
                      onFocus={e => focusStyle(e, 'temperature')} onBlur={e => blurStyle(e, 'temperature')} />
                  </Field>
                  <Field label="Oxygen Saturation (%)" error={errors.oxygenSat}>
                    <input type="number" min={0} max={100} value={form.oxygenSat} onChange={set('oxygenSat')} placeholder="98" style={inp('oxygenSat')}
                      onFocus={e => focusStyle(e, 'oxygenSat')} onBlur={e => blurStyle(e, 'oxygenSat')} />
                  </Field>
                </div>
                <Field label="Weight (kg)" error={errors.weight}>
                  <input type="number" value={form.weight} onChange={set('weight')} placeholder="70" style={{ ...inp('weight'), maxWidth: 'calc(50% - 8px)' }}
                    onFocus={e => focusStyle(e, 'weight')} onBlur={e => blurStyle(e, 'weight')} />
                </Field>
                <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Patient ID <strong style={{ color: 'var(--text-primary)' }}>{nextId}</strong> will be assigned on creation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={step === 0 ? onClose : back}
            style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <button onClick={step < 2 ? next : submit}
            style={{ padding: '10px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, border: 'none', background: step < 2 ? '#3c83f6' : '#0ea5e9', color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(60,131,246,0.3)' }}>
            {step < 2 ? 'Next →' : '+ Add Patient'}
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
}
