import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, Filter, X, ChevronDown, Activity, Heart, UserPlus } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Avatar } from '@/components/ui/Avatar';
import { AddPatientModal } from '@/components/AddPatientModal';
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

function PatientCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const isCritical = patient.status === 'Critical';
  return (
    <motion.div variants={item} onClick={onClick} whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card"
      style={{ borderRadius: '20px', padding: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderColor: isCritical ? 'rgba(239,68,68,0.4)' : undefined }}>
      {isCritical && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 2s ease-in-out infinite' }} />}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'var(--gradient-card)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
          <Avatar initials={patient.avatar} size={44} radius="14px" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.name}</h3>
              <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '8px', flexShrink: 0, background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}>{patient.status}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{patient.id} · {patient.age}y · {patient.gender}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Activity size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.diagnosis}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Heart size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.department}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-primary)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{patient.doctor}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: '8px' }}>{formatDate(patient.lastVisit)}</span>
        </div>
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
      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar initials={patient.avatar} size={36} radius="10px" />
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

export default function PatientDetailsPage() {
  const dispatch = useAppDispatch();
  const { patients, filteredPatients, viewMode, searchQuery, filterStatus, filterDepartment } = useAppSelector(s => s.patients);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const hasActiveFilters = filterStatus !== 'All' || filterDepartment !== 'All';

  const handlePatientClick = async (patient: Patient) => {
    dispatch(setSelectedPatient(patient));
    if (patient.status === 'Critical') await showPatientAlertNotification(patient.name, patient.diagnosis);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Patients</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredPatients.length} of {patients.length} patients</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: '#3c83f6', color: 'white', boxShadow: '0 4px 14px rgba(60,131,246,0.3)' }}>
              <UserPlus size={15} /> Add Patient
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              {[{ mode: 'grid' as const, icon: <Grid3X3 size={15} />, label: 'Grid' }, { mode: 'list' as const, icon: <List size={15} />, label: 'List' }].map(({ mode, icon, label }) => (
                <button key={mode} onClick={() => dispatch(setViewMode(mode))}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease', background: viewMode === mode ? 'var(--accent-blue)' : 'transparent', color: viewMode === mode ? 'white' : 'var(--text-secondary)' }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="glow-line" style={{ marginTop: '16px' }} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <SearchInput value={searchQuery} onChange={v => dispatch(setSearchQuery(v))} placeholder="Search by name, diagnosis, doctor..." />
        <button onClick={() => setShowFilters(!showFilters)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, border: `1px solid ${hasActiveFilters ? 'rgba(60,131,246,0.4)' : 'var(--border-primary)'}`, background: hasActiveFilters ? 'rgba(60,131,246,0.1)' : 'var(--bg-secondary)', color: hasActiveFilters ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms ease' }}>
          <Filter size={15} /> Filters {hasActiveFilters && <Badge variant="info">Active</Badge>}
          <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: showFilters ? 'rotate(180deg)' : 'none' }} />
        </button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(clearFilters())} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <X size={14} /> Clear
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            animate={{ opacity: 1, maxHeight: 240, marginBottom: 24 }}
            exit={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card" style={{ borderRadius: '16px', padding: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[{ label: 'Status', items: STATUSES, current: filterStatus, action: setFilterStatus }, { label: 'Department', items: DEPARTMENTS, current: filterDepartment, action: setFilterDepartment }].map(({ label, items, current, action }) => (
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

      {filteredPatients.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>No patients found</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => dispatch(clearFilters())} style={{ marginTop: '16px' }}>Clear Filters</Button>
        </motion.div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
      `}</style>

      <AnimatePresence>
        {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
