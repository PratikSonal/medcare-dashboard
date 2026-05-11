import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CreditCard, TrendingUp, Clock, CheckCircle, SlidersHorizontal, X, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';
import { updateClaimStatus } from '@/features/billing/billingSlice';
import type { ClaimStatus } from '@/types';
import { formatCompact, PROVIDER_SHORT } from '@/lib/utils';
import { CLAIM_STATUS_COLORS } from '@/lib/constants';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ttStyle = { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'Poppins', fontSize: '12px' } };


const ALL_STATUSES: ClaimStatus[] = ['Approved', 'Partial', 'Pending', 'Denied'];
const PAGE_SIZE = 8;

export default function BillingPage() {
  const dispatch = useAppDispatch();
  const records = useAppSelector(s => s.billing.records);
  const patients = useAppSelector(s => s.patients.patients);

  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus[]>([]);
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const selectedRecord = selectedRecordId ? (records.find(r => r.id === selectedRecordId) ?? null) : null;

  const allProviders = useMemo(() => [...new Set(records.map(r => r.insuranceProvider))], [records]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(r => {
      const matchSearch =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.procedure.toLowerCase().includes(q) ||
        r.insuranceProvider.toLowerCase().includes(q);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(r.claimStatus);
      const matchProvider = providerFilter.length === 0 || providerFilter.includes(r.insuranceProvider);
      return matchSearch && matchStatus && matchProvider;
    });
  }, [records, search, statusFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRecords = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalBilled = records.reduce((s, r) => s + r.totalAmount, 0);
  const insuranceCoveredTotal = records.reduce((s, r) => s + r.insuranceCovered, 0);
  const patientDueTotal = records.reduce((s, r) => s + r.patientDue, 0);
  const pendingRecords = records.filter(r => r.claimStatus === 'Pending');
  const pendingAmount = pendingRecords.reduce((s, r) => s + r.totalAmount, 0);

  const leaderboard = useMemo(
    () => [...records].sort((a, b) => b.patientDue - a.patientDue).slice(0, 5),
    [records]
  );

  const claimStatusData = ALL_STATUSES.map(s => ({
    name: s,
    value: records.filter(r => r.claimStatus === s).length,
    color: CLAIM_STATUS_COLORS[s].color,
  }));

  const providerMap: Record<string, { approved: number; partial: number; pending: number; denied: number }> = {};
  records.forEach(r => {
    const name = PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider;
    if (!providerMap[name]) providerMap[name] = { approved: 0, partial: 0, pending: 0, denied: 0 };
    const key = r.claimStatus.toLowerCase() as 'approved' | 'partial' | 'pending' | 'denied';
    providerMap[name][key]++;
  });
  const providerData = Object.entries(providerMap).map(([name, counts]) => ({ name, ...counts }));

  const kpis = [
    { title: 'Total Billed', value: formatCompact(totalBilled), sub: `${records.length} records`, icon: <CreditCard size={20} />, color: '#3c83f6' },
    { title: 'Insurance Settled', value: formatCompact(insuranceCoveredTotal), sub: `${Math.round((insuranceCoveredTotal / totalBilled) * 100)}% of total`, icon: <CheckCircle size={20} />, color: '#0ea5e9' },
    { title: 'Patient Outstanding', value: formatCompact(patientDueTotal), sub: 'Across all visits', icon: <TrendingUp size={20} />, color: '#7c3bed' },
    { title: 'Pending Claims', value: `${pendingRecords.length}`, sub: formatCompact(pendingAmount) + ' at risk', icon: <Clock size={20} />, color: '#f59e0b' },
  ];

  const activeFilters = statusFilter.length + providerFilter.length;

  const toggleStatus = (s: ClaimStatus) => {
    setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setPage(1);
  };

  const toggleProvider = (p: string) => {
    setProviderFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setPage(1);
  };

  const handleViewProfile = () => {
    if (!selectedRecord) return;
    const patient = patients.find(p => p.id === selectedRecord.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    setSelectedRecordId(null);
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div variants={item} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>Billing & Revenue</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Insurance claims, payments, and financial overview</p>
            </div>
            <Badge variant="info">May 2026</Badge>
          </div>
          <div className="glow-line" style={{ marginTop: '24px' }} />
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {kpis.map(k => (
            <motion.div key={k.title} className="glass-card" whileHover={{ y: -3, transition: { duration: 0.2 } }}
              style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: `radial-gradient(circle at top right, ${k.color}, transparent)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{k.title}</p>
                  <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{k.value}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>{k.sub}</p>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', background: `${k.color}18`, color: k.color }}>{k.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Provider Performance */}
          <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Provider Performance</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Claims by status per insurance provider</p>
            </div>
            <div style={{ flex: 1, minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...ttStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)', paddingTop: '12px' }} />
                  <Bar dataKey="approved" name="Approved" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="partial" name="Partial" stackId="a" fill="#7c3bed" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="denied" name="Denied" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Claim Status Donut */}
          <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Claim Status</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{records.length} total claims</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={claimStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {claimStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...ttStyle} formatter={(v) => [`${v} claims`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {claimStatusData.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{records.length > 0 ? Math.round((s.value / records.length) * 100) : 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Outstanding Balance Leaderboard */}
          <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Trophy size={15} style={{ color: '#f59e0b' }} />
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Outstanding Balance</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Top 5 by patient due amount</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: i === 0 ? '#f59e0b' : 'var(--text-tertiary)', width: '18px', flexShrink: 0, textAlign: 'right' }}>#{i + 1}</span>
                  <Avatar initials={r.patientAvatar} size={28} radius="50%" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.patientName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{r.department}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: r.patientDue > 50000 ? 'var(--accent-red)' : 'var(--text-primary)', flexShrink: 0 }}>{formatCompact(r.patientDue)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Billing Records */}
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>

          {/* Table header + controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Billing Records</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {filtered.length} record{filtered.length !== 1 ? 's' : ''}{activeFilters > 0 ? ' (filtered)' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search patient, doctor, procedure..." width={260} />
              <button
                onClick={() => setFilterOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${activeFilters > 0 ? 'var(--accent-blue)' : 'var(--border-primary)'}`, background: activeFilters > 0 ? 'rgba(60,131,246,0.08)' : 'var(--bg-secondary)', color: activeFilters > 0 ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins' }}>
                <SlidersHorizontal size={14} />
                Filters
                {activeFilters > 0 && (
                  <span style={{ background: 'var(--accent-blue)', color: 'white', borderRadius: '99px', fontSize: '10px', fontWeight: 700, padding: '1px 6px' }}>{activeFilters}</span>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible filter panel */}
          <motion.div
            initial={false}
            animate={{ maxHeight: filterOpen ? 200 : 0, opacity: filterOpen ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', width: '70px', flexShrink: 0 }}>Status</span>
                {ALL_STATUSES.map(s => {
                  const active = statusFilter.includes(s);
                  return (
                    <button key={s} onClick={() => toggleStatus(s)}
                      style={{ padding: '4px 12px', borderRadius: '99px', border: `1px solid ${active ? CLAIM_STATUS_COLORS[s].color : 'var(--border-primary)'}`, background: active ? CLAIM_STATUS_COLORS[s].bg : 'transparent', color: active ? CLAIM_STATUS_COLORS[s].color : 'var(--text-secondary)', fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'Poppins', transition: 'all 150ms ease' }}>
                      {s}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', width: '70px', flexShrink: 0, paddingTop: '5px' }}>Provider</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {allProviders.map(p => {
                    const active = providerFilter.includes(p);
                    return (
                      <button key={p} onClick={() => toggleProvider(p)}
                        style={{ padding: '4px 12px', borderRadius: '99px', border: `1px solid ${active ? 'var(--accent-blue)' : 'var(--border-primary)'}`, background: active ? 'rgba(60,131,246,0.1)' : 'transparent', color: active ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'Poppins', transition: 'all 150ms ease' }}>
                        {PROVIDER_SHORT[p] || p}
                      </button>
                    );
                  })}
                </div>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setStatusFilter([]); setProviderFilter([]); setPage(1); }}
                  style={{ marginTop: '12px', fontSize: '12px', color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', padding: 0 }}>
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {['Patient', 'Date', 'Procedure', 'Doctor', 'Insurance Provider', 'Total', 'Status', 'Patient Due'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                      No records match your search or filters.
                    </td>
                  </tr>
                ) : pagedRecords.map((r, i) => (
                  <tr key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    style={{ borderBottom: i < pagedRecords.length - 1 ? '1px solid var(--border-primary)' : 'none', transition: 'background 200ms ease', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={r.patientAvatar} size={28} radius="50%" />
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{r.patientName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(r.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.procedure}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{r.department}</p>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.doctor}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>₹{r.totalAmount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap', background: CLAIM_STATUS_COLORS[r.claimStatus].bg, color: CLAIM_STATUS_COLORS[r.claimStatus].color }}>{r.claimStatus}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, whiteSpace: 'nowrap', color: r.patientDue > 50000 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                      ₹{r.patientDue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: safePage === 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)', cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${p === safePage ? 'var(--accent-blue)' : 'var(--border-primary)'}`, background: p === safePage ? 'rgba(60,131,246,0.1)' : 'var(--bg-secondary)', color: p === safePage ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: p === safePage ? 600 : 400, cursor: 'pointer', fontFamily: 'Poppins' }}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: safePage === totalPages ? 'var(--text-tertiary)' : 'var(--text-secondary)', cursor: safePage === totalPages ? 'not-allowed' : 'pointer' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Billing Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={() => setSelectedRecordId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-card"
              style={{ borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar initials={selectedRecord.patientAvatar} size={44} radius="50%" />
                  <div>
                    <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedRecord.patientName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(60,131,246,0.1)', color: 'var(--accent-blue)', fontWeight: 500 }}>{selectedRecord.department}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{selectedRecord.policyNumber}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecordId(null)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>

              {/* Visit info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Visit Date</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{new Date(selectedRecord.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Doctor</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRecord.doctor}</p>
                </div>
              </div>

              {/* Procedure */}
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Procedure</p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{selectedRecord.procedure}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{selectedRecord.insuranceProvider}</p>
              </div>

              {/* Financial breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Billed', value: `₹${selectedRecord.totalAmount.toLocaleString('en-IN')}`, color: '#3c83f6' },
                  { label: 'Ins. Covered', value: `₹${selectedRecord.insuranceCovered.toLocaleString('en-IN')}`, color: '#0ea5e9' },
                  { label: 'Patient Due', value: `₹${selectedRecord.patientDue.toLocaleString('en-IN')}`, color: selectedRecord.patientDue > 50000 ? '#ef4444' : '#7c3bed' },
                ].map(f => (
                  <div key={f.label} style={{ padding: '14px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', border: `1px solid ${f.color}30`, textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</p>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: f.color }}>{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Claim status update */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Update Claim Status</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ALL_STATUSES.map(s => {
                    const isActive = selectedRecord.claimStatus === s;
                    return (
                      <button key={s}
                        onClick={() => dispatch(updateClaimStatus({ id: selectedRecord.id, status: s }))}
                        style={{ padding: '6px 16px', borderRadius: '10px', border: `1px solid ${isActive ? CLAIM_STATUS_COLORS[s].color : 'var(--border-primary)'}`, background: isActive ? CLAIM_STATUS_COLORS[s].bg : 'transparent', color: isActive ? CLAIM_STATUS_COLORS[s].color : 'var(--text-secondary)', fontSize: '13px', fontWeight: isActive ? 600 : 400, cursor: 'pointer', fontFamily: 'Poppins', transition: 'all 150ms ease' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
                <button
                  onClick={() => setSelectedRecordId(null)}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins' }}>
                  Close
                </button>
                <button
                  onClick={handleViewProfile}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'var(--gradient-primary)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}>
                  View Patient Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
