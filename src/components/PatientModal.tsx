import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield, Pill, Calendar, Phone, Mail, MapPin, Heart, Thermometer, Wind, Activity, AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { Patient } from '@/types';
import { mockBillingData, mockPrescriptions } from '@/lib/mockData';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { getStatusBg, getStatusColor, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS, CLAIM_STATUS_COLORS } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';

const PRESCRIPTION_COLORS = {
  Active: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  Completed: { color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)' },
  Discontinued: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const APP_STATUS: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Confirmed: { ...APPT_STATUS_COLORS.Confirmed, icon: <CheckCircle size={11} /> },
  Pending:   { ...APPT_STATUS_COLORS.Pending,   icon: <AlertCircle size={11} /> },
  Completed: { ...APPT_STATUS_COLORS.Completed, icon: <CheckCircle size={11} /> },
  Cancelled: { ...APPT_STATUS_COLORS.Cancelled, icon: <XCircle size={11} /> },
  'No-Show': { ...APPT_STATUS_COLORS['No-Show'], icon: <XCircle size={11} /> },
};

function VitalBadge({ icon, label, value, alert = false }: { icon: React.ReactNode; label: string; value: string | number; alert?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 8px', borderRadius: '12px', background: alert ? 'rgba(239,68,68,0.08)' : 'var(--bg-tertiary)', border: `1px solid ${alert ? 'rgba(239,68,68,0.2)' : 'var(--border-primary)'}` }}>
      <div style={{ color: alert ? 'var(--accent-red)' : 'var(--accent-blue)' }}>{icon}</div>
      <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px', textAlign: 'center' }}>{label}</p>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', textAlign: 'center' }}>{value}</p>
    </div>
  );
}

export function PatientModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'appointments' | 'billing' | 'prescriptions'>('overview');

  const allAppointments = useAppSelector(s => s.appointments.appointments);
  const billingRecords = mockBillingData.filter(r => r.patientId === patient.id);
  const prescriptions = mockPrescriptions.filter(r => r.patientId === patient.id);
  const appointments = allAppointments.filter(a => a.patientId === patient.id);
  const billing = billingRecords[0];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <FileText size={13} /> },
    { id: 'appointments' as const, label: 'Appointments', icon: <Calendar size={13} />, count: appointments.length },
    { id: 'billing' as const, label: 'Insurance & Billing', icon: <Shield size={13} /> },
    { id: 'prescriptions' as const, label: 'Prescriptions', icon: <Pill size={13} />, count: prescriptions.filter(r => r.status === 'Active').length },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{ width: '100%', maxWidth: '660px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', flexShrink: 0, position: 'relative' }}>
          {patient.status === 'Critical' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--accent-red)' }}>
              <AlertTriangle size={14} /> Critical patient — immediate attention required
            </div>
          )}
          <button onClick={onClose}
            style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <Avatar initials={patient.avatar} size={60} radius="18px" />
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{patient.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{patient.id} · {patient.age}y · {patient.gender} · {patient.bloodGroup}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, padding: '4px 12px', borderRadius: '10px', background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
                {patient.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', borderBottom: '1px solid var(--border-primary)', flexShrink: 0, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: tab === t.id ? 'var(--accent-blue)' : 'transparent', color: tab === t.id ? 'white' : 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t.icon} {t.label}
              {'count' in t && t.count! > 0 && (
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: tab === t.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)', color: tab === t.id ? 'white' : 'var(--text-tertiary)', fontWeight: 600 }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          <AnimatePresence mode="wait">

            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[{ label: 'Diagnosis', value: patient.diagnosis }, { label: 'Department', value: patient.department }, { label: 'Attending Doctor', value: patient.doctor }, { label: 'Admitted On', value: formatDate(patient.admissionDate) }].map(({ label, value }) => (
                    <div key={label} className="glass-card" style={{ borderRadius: '14px', padding: '14px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Current Vitals</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    <VitalBadge icon={<Heart size={16} />} label="Heart Rate" value={`${patient.vitals.heartRate} bpm`} alert={patient.vitals.heartRate > 100} />
                    <VitalBadge icon={<Activity size={16} />} label="BP" value={patient.vitals.bloodPressure} alert={parseInt(patient.vitals.bloodPressure) > 140} />
                    <VitalBadge icon={<Thermometer size={16} />} label="Temp" value={`${patient.vitals.temperature}°F`} alert={patient.vitals.temperature > 100} />
                    <VitalBadge icon={<Wind size={16} />} label="O₂ Sat" value={`${patient.vitals.oxygenSat}%`} alert={patient.vitals.oxygenSat < 93} />
                    <VitalBadge icon={<Activity size={16} />} label="Weight" value={`${patient.vitals.weight}kg`} />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Contact Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[{ icon: <Phone size={14} />, text: patient.phone }, { icon: <Mail size={14} />, text: patient.email }, { icon: <MapPin size={14} />, text: patient.address }].map(({ icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-blue)' }}>{icon}</span>{text}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'appointments' && (
              <motion.div key="appointments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {appointments.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {appointments.map(app => {
                      const sc = APP_STATUS[app.status];
                      const typeColor = APPT_TYPE_COLORS[app.type] || 'var(--accent-blue)';
                      return (
                        <div key={app.id} style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderLeft: `3px solid ${typeColor}` }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {new Date(app.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {app.time}
                                </p>
                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, fontWeight: 500 }}>{app.type}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{app.doctor} · {app.department}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{app.clinicName} · {app.duration} min</p>
                            </div>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '8px', background: sc.bg, color: sc.color, flexShrink: 0 }}>
                              {sc.icon} {app.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.intakeComplete ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)', color: app.intakeComplete ? '#0ea5e9' : '#f59e0b', border: `1px solid ${app.intakeComplete ? 'rgba(14,165,233,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                              {app.intakeComplete ? '✓ Intake' : '⏳ Intake Pending'}
                            </span>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: app.insuranceVerified ? 'rgba(14,165,233,0.1)' : 'rgba(239,68,68,0.1)', color: app.insuranceVerified ? '#0ea5e9' : '#ef4444', border: `1px solid ${app.insuranceVerified ? 'rgba(14,165,233,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                              {app.insuranceVerified ? '✓ Insurance Verified' : '✗ Insurance Unverified'}
                            </span>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}>
                              {app.insuranceProvider}
                            </span>
                          </div>
                          {app.notes && <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.08)' }}>⚠️ {app.notes}</p>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
                    <Calendar size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px' }}>No appointments on record</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {billing ? (
                  <>
                    <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(60,131,246,0.06)', border: '1px solid rgba(60,131,246,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <Shield size={15} style={{ color: 'var(--accent-blue)' }} />
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Insurance Details</h3>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', background: billing.insuranceCovered > 0 ? 'rgba(14,165,233,0.1)' : 'rgba(239,68,68,0.1)', color: billing.insuranceCovered > 0 ? '#0ea5e9' : '#ef4444' }}>
                          {billing.insuranceCovered > 0 ? 'Covered' : 'Unverified'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[{ label: 'Provider', value: billing.insuranceProvider }, { label: 'Policy Number', value: billing.policyNumber }].map(({ label, value }) => (
                          <div key={label} style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-card)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '3px' }}>{label}</p>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Billing History</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {billingRecords.map(r => (
                          <div key={r.id} style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.procedure}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{r.department} · {new Date(r.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', flexShrink: 0, background: CLAIM_STATUS_COLORS[r.claimStatus].bg, color: CLAIM_STATUS_COLORS[r.claimStatus].color }}>
                                {r.claimStatus}
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                              {[{ label: 'Total', value: `₹${r.totalAmount.toLocaleString('en-IN')}` }, { label: 'Insurance', value: `₹${r.insuranceCovered.toLocaleString('en-IN')}` }, { label: 'Patient Due', value: `₹${r.patientDue.toLocaleString('en-IN')}` }].map(({ label, value }) => (
                                <div key={label}>
                                  <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{label}</p>
                                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
                    <Shield size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px' }}>No billing records found</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'prescriptions' && (
              <motion.div key="prescriptions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {prescriptions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {prescriptions.map(rx => {
                      const sc = PRESCRIPTION_COLORS[rx.status];
                      return (
                        <div key={rx.id} style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{rx.medication} <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-secondary)' }}>{rx.dosage}</span></p>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>{rx.frequency} · {rx.duration}</p>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', flexShrink: 0, background: sc.bg, color: sc.color }}>{rx.status}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{rx.prescribedBy} · {new Date(rx.prescribedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            {rx.refillsLeft !== undefined && rx.status === 'Active' && (
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: rx.refillsLeft > 0 ? 'rgba(60,131,246,0.1)' : 'rgba(245,158,11,0.1)', color: rx.refillsLeft > 0 ? 'var(--accent-blue)' : '#f59e0b' }}>
                                {rx.refillsLeft > 0 ? `${rx.refillsLeft} refill${rx.refillsLeft > 1 ? 's' : ''} left` : 'No refills'}
                              </span>
                            )}
                          </div>
                          {rx.notes && <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.08)' }}>⚠️ {rx.notes}</p>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
                    <Pill size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px' }}>No prescriptions on record</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
