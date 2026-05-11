import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, List, Filter, X, ChevronDown, Phone, Mail, MapPin, Heart, Thermometer, Wind, Activity, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setViewMode, setSearchQuery, setFilterStatus, setFilterDepartment, clearFilters, setSelectedPatient } from '@/features/patients/patientsSlice';
import { showPatientAlertNotification } from '@/lib/notifications';
import type { Patient } from '@/types';
import { getStatusBg, getStatusColor, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const DEPARTMENTS = ['All', 'Cardiology', 'Neurology', 'Pulmonology', 'Endocrinology', 'Orthopedics', 'Surgery', 'Nephrology', 'Internal Medicine', 'Gastroenterology', 'Rheumatology'];
const STATUSES = ['All', 'Active', 'Critical', 'Recovering', 'Discharged'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function VitalBadge({ icon, label, value, alert = false }: { icon: React.ReactNode; label: string; value: string | number; alert?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 8px', borderRadius: '12px', background: alert ? 'rgba(239,68,68,0.08)' : 'var(--bg-tertiary)', border: `1px solid ${alert ? 'rgba(239,68,68,0.2)' : 'var(--border-primary)'}` }}>
      <div style={{ color: alert ? 'var(--accent-red)' : 'var(--accent-blue)' }}>{icon}</div>
      <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px', textAlign: 'center' }}>{label}</p>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', textAlign: 'center' }}>{value}</p>
    </div>
  );
}

function PatientCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const isCritical = patient.status === 'Critical';
  return (
    <motion.div variants={item}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card"
      style={{ borderRadius: '20px', padding: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderColor: isCritical ? 'rgba(239,68,68,0.4)' : undefined }}
    >
      {isCritical && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 2s ease-in-out infinite' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'var(--gradient-card)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        {/* Avatar + Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>{patient.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.name}</h3>
              <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '8px', flexShrink: 0, background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{patient.id} · {patient.age}y · {patient.gender}</p>
          </div>
        </div>
        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Activity size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.diagnosis}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Heart size={12} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.department}</span>
          </div>
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-primary)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{patient.doctor}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: '8px' }}>{formatDate(patient.lastVisit)}</span>
        </div>
        {/* Tags */}
        {patient.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {patient.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>{tag}</span>
            ))}
            {patient.tags.length > 2 && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>+{patient.tags.length - 2}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PatientListRow({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  return (
    <motion.tr variants={item} onClick={onClick}
      style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-primary)', transition: 'background 200ms ease' }}
      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-tertiary)'}
      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
    >
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>{patient.avatar}</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{patient.name}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{patient.id}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{patient.age}y · {patient.gender}</td>
      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{patient.diagnosis}</td>
      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{patient.department}</td>
      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{patient.doctor}</td>
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '8px', background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{formatDate(patient.lastVisit)}</td>
    </motion.tr>
  );
}

function PatientModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', position: 'relative' }}>
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
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{patient.avatar}</div>
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

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Medical info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[{ label: 'Diagnosis', value: patient.diagnosis }, { label: 'Department', value: patient.department }, { label: 'Attending Doctor', value: patient.doctor }, { label: 'Admitted On', value: formatDate(patient.admissionDate) }].map(({ label, value }) => (
              <div key={label} className="glass-card" style={{ borderRadius: '14px', padding: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Vitals */}
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

          {/* Contact */}
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
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PatientDetailsPage() {
  const dispatch = useAppDispatch();
  const { filteredPatients, viewMode, searchQuery, filterStatus, filterDepartment, selectedPatient } = useAppSelector(s => s.patients);
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = filterStatus !== 'All' || filterDepartment !== 'All';

  const handlePatientClick = async (patient: Patient) => {
    dispatch(setSelectedPatient(patient));
    if (patient.status === 'Critical') await showPatientAlertNotification(patient.name, patient.diagnosis);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Patients</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredPatients.length} of 20 patients</p>
          </div>
          {/* View toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            {[{ mode: 'grid' as const, icon: <Grid3X3 size={15} />, label: 'Grid' }, { mode: 'list' as const, icon: <List size={15} />, label: 'List' }].map(({ mode, icon, label }) => (
              <button key={mode} onClick={() => dispatch(setViewMode(mode))}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: viewMode === mode ? 'var(--accent-blue)' : 'transparent', color: viewMode === mode ? 'white' : 'var(--text-secondary)' }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
        <div className="glow-line" style={{ marginTop: '16px' }} />
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={searchQuery} onChange={e => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by name, diagnosis, doctor..."
            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '10px 16px 10px 38px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', transition: 'border-color 200ms ease' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, border: `1px solid ${hasActiveFilters ? 'rgba(60,131,246,0.4)' : 'var(--border-primary)'}`, background: hasActiveFilters ? 'rgba(60,131,246,0.1)' : 'var(--bg-secondary)', color: hasActiveFilters ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease' }}>
          <Filter size={15} /> Filters {hasActiveFilters && <Badge variant="info">Active</Badge>}
          <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: showFilters ? 'rotate(180deg)' : 'none' }} />
        </button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(clearFilters())}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <X size={14} /> Clear
          </Button>
        )}
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { label: 'Status', items: STATUSES, current: filterStatus, action: setFilterStatus },
                { label: 'Department', items: DEPARTMENTS, current: filterDepartment, action: setFilterDepartment },
              ].map(({ label, items, current, action }) => (
                <div key={label}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{label}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {items.map(s => (
                      <button key={s} onClick={() => dispatch(action(s))}
                        style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: current === s ? 'var(--accent-blue)' : 'var(--bg-tertiary)', color: current === s ? 'white' : 'var(--text-secondary)' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div key="grid" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filteredPatients.map(p => <PatientCard key={p.id} patient={p} onClick={() => handlePatientClick(p)} />)}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
                <tr>
                  {['Patient', 'Age / Gender', 'Diagnosis', 'Department', 'Doctor', 'Status', 'Last Visit'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filteredPatients.map(p => <PatientListRow key={p.id} patient={p} onClick={() => handlePatientClick(p)} />)}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {filteredPatients.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>No patients found</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => dispatch(clearFilters())} style={{ marginTop: '16px' }}>Clear Filters</Button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedPatient && <PatientModal patient={selectedPatient} onClose={() => dispatch(setSelectedPatient(null))} />}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
