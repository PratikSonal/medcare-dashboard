import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CreditCard, TrendingUp, Clock, CheckCircle, SlidersHorizontal, X, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/SearchInput';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';
import { updateClaimStatus } from '@/features/billing/billingSlice';
import type { ClaimStatus } from '@/types';
import { formatCompact, PROVIDER_SHORT } from '@/lib/utils';
import { CLAIM_STATUS_COLORS } from '@/lib/constants';
import { container, item, ttStyle, ALL_STATUSES, PAGE_SIZE } from './constants';

const BillingPage = () => {
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
      const matchSearch = !q || r.patientName.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q) || r.procedure.toLowerCase().includes(q) || r.insuranceProvider.toLowerCase().includes(q);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(r.claimStatus);
      const matchProvider = providerFilter.length === 0 || providerFilter.includes(r.insuranceProvider);
      return matchSearch && matchStatus && matchProvider;
    });
  }, [records, search, statusFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRecords = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalBilled = useMemo(() => records.reduce((s, r) => s + r.totalAmount, 0), [records]);
  const insuranceCoveredTotal = useMemo(() => records.reduce((s, r) => s + r.insuranceCovered, 0), [records]);
  const patientDueTotal = useMemo(() => records.reduce((s, r) => s + r.patientDue, 0), [records]);
  const pendingRecords = useMemo(() => records.filter(r => r.claimStatus === 'Pending'), [records]);
  const pendingAmount = useMemo(() => pendingRecords.reduce((s, r) => s + r.totalAmount, 0), [pendingRecords]);

  const leaderboard = useMemo(() => [...records].sort((a, b) => b.patientDue - a.patientDue).slice(0, 5), [records]);

  const claimStatusData = useMemo(() => ALL_STATUSES.map(s => ({ name: s, value: records.filter(r => r.claimStatus === s).length, color: CLAIM_STATUS_COLORS[s].color })), [records]);

  const providerData = useMemo(() => {
    const map: Record<string, { approved: number; partial: number; pending: number; denied: number }> = {};
    records.forEach(r => {
      const name = PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider;
      if (!map[name]) map[name] = { approved: 0, partial: 0, pending: 0, denied: 0 };
      const key = r.claimStatus.toLowerCase() as 'approved' | 'partial' | 'pending' | 'denied';
      map[name][key]++;
    });
    return Object.entries(map).map(([name, counts]) => ({ name, ...counts }));
  }, [records]);

  const kpis = [
    { title: 'Total Billed',         rawValue: totalBilled,            format: formatCompact, sub: `${records.length} records`,                                            icon: <CreditCard size={20} />,  color: '#3c83f6' },
    { title: 'Insurance Settled',    rawValue: insuranceCoveredTotal,  format: formatCompact, sub: `${Math.round((insuranceCoveredTotal / totalBilled) * 100)}% of total`, icon: <CheckCircle size={20} />, color: '#0ea5e9' },
    { title: 'Patient Outstanding',  rawValue: patientDueTotal,        format: formatCompact, sub: 'Across all visits',                                                     icon: <TrendingUp size={20} />,  color: '#7c3bed' },
    { title: 'Pending Claims',       rawValue: pendingRecords.length,                         sub: formatCompact(pendingAmount) + ' at risk',                               icon: <Clock size={20} />,       color: '#f59e0b' },
  ];

  const activeFilters = statusFilter.length + providerFilter.length;

  const toggleStatus = (s: ClaimStatus) => { setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); setPage(1); };
  const toggleProvider = (p: string) => { setProviderFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]); setPage(1); };

  const handleViewProfile = () => {
    if (!selectedRecord) return;
    const patient = patients.find(p => p.id === selectedRecord.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    setSelectedRecordId(null);
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1280px] mx-auto">

        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[30px] font-bold text-text-primary">Billing & Revenue</h1>
              <p className="text-sm text-text-secondary mt-1">Insurance claims, payments, and financial overview</p>
            </div>
            <Badge variant="info">May 2026</Badge>
          </div>
          <div className="glow-line mt-6" />
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {kpis.map(k => (
            <KpiCard key={k.title} title={k.title} rawValue={k.rawValue} format={k.format} sub={k.sub} icon={k.icon} color={k.color} />
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>

          {/* Provider Performance */}
          <motion.div variants={item} className="glass-card rounded-20 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-text-primary">Provider Performance</h2>
              <p className="text-[13px] text-text-secondary mt-[2px]">Claims by status per insurance provider</p>
            </div>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...ttStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)', paddingTop: '12px' }} />
                  <Bar dataKey="approved" name="Approved" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="partial"  name="Partial"  stackId="a" fill="#7c3bed" />
                  <Bar dataKey="pending"  name="Pending"  stackId="a" fill="#f59e0b" />
                  <Bar dataKey="denied"   name="Denied"   stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Claim Status Donut */}
          <motion.div variants={item} className="glass-card rounded-20 p-6">
            <div className="mb-3">
              <h2 className="text-base font-semibold text-text-primary">Claim Status</h2>
              <p className="text-[13px] text-text-secondary mt-[2px]">{records.length} total claims</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={claimStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {claimStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...ttStyle} formatter={(v) => [`${v} claims`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-1">
              {claimStatusData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-text-secondary">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="text-xs font-semibold text-text-primary">{s.value}</span>
                    <span className="text-[11px] text-text-tertiary">{records.length > 0 ? Math.round((s.value / records.length) * 100) : 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Outstanding Balance Leaderboard */}
          <motion.div variants={item} className="glass-card rounded-20 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={15} className="text-accent-yellow" />
              <h2 className="text-base font-semibold text-text-primary">Outstanding Balance</h2>
            </div>
            <p className="text-[13px] text-text-secondary mb-4">Top 5 by patient due amount</p>
            <div className="flex flex-col gap-3">
              {leaderboard.map((r, i) => (
                <motion.div key={r.id} whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }} className="flex items-center gap-[10px] px-2 py-1 -mx-2 rounded-[10px] cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary">
                  <span className={cn('text-[11px] font-bold w-[18px] shrink-0 text-right', i === 0 ? 'text-accent-yellow' : 'text-text-tertiary')}>#{i + 1}</span>
                  <Avatar initials={r.patientAvatar} size={28} radius="50%" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{r.patientName}</p>
                    <p className="text-[11px] text-text-tertiary">{r.department}</p>
                  </div>
                  <span className={cn('text-xs font-bold shrink-0', r.patientDue > 50000 ? 'text-accent-red' : 'text-text-primary')}>{formatCompact(r.patientDue)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Billing Records */}
        <motion.div variants={item} className="glass-card rounded-20 p-6">
          {/* Table header + controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Billing Records</h2>
              <p className="text-[13px] text-text-secondary mt-[2px]">
                {filtered.length} record{filtered.length !== 1 ? 's' : ''}{activeFilters > 0 ? ' (filtered)' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search patient, doctor, procedure..." width={260} />
              <button
                onClick={() => setFilterOpen(o => !o)}
                className={cn('flex items-center gap-[6px] px-[14px] py-2 rounded-[10px] text-[13px] font-medium cursor-pointer font-sans transition-all duration-150 border', activeFilters > 0 ? 'border-accent-blue bg-[rgba(60,131,246,0.08)] text-accent-blue' : 'border-border-primary bg-bg-secondary text-text-secondary')}>
                <SlidersHorizontal size={14} />
                Filters
                {activeFilters > 0 && (
                  <span className="bg-accent-blue text-white rounded-full text-[10px] font-bold px-[6px] py-[1px]">{activeFilters}</span>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible filter panel */}
          <motion.div initial={false} animate={{ maxHeight: filterOpen ? 200 : 0, opacity: filterOpen ? 1 : 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} style={{ overflow: 'hidden' }}>
            <div className="p-4 rounded-12 bg-bg-secondary border border-border-primary mb-4">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] w-[70px] shrink-0">Status</span>
                {ALL_STATUSES.map(s => {
                  const active = statusFilter.includes(s);
                  return (
                    <button key={s} onClick={() => toggleStatus(s)}
                      className="px-3 py-1 rounded-full text-xs cursor-pointer font-sans transition-all duration-150"
                      style={{ border: `1px solid ${active ? CLAIM_STATUS_COLORS[s].color : 'var(--border-primary)'}`, background: active ? CLAIM_STATUS_COLORS[s].bg : 'transparent', color: active ? CLAIM_STATUS_COLORS[s].color : 'var(--text-secondary)', fontWeight: active ? 600 : 400 }}>
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] w-[70px] shrink-0 pt-[5px]">Provider</span>
                <div className="flex flex-wrap gap-[6px]">
                  {allProviders.map(p => {
                    const active = providerFilter.includes(p);
                    return (
                      <button key={p} onClick={() => toggleProvider(p)}
                        className={cn('px-3 py-1 rounded-full text-xs cursor-pointer font-sans transition-all duration-150 border', active ? 'border-accent-blue bg-[rgba(60,131,246,0.1)] text-accent-blue font-semibold' : 'border-border-primary bg-transparent text-text-secondary')}>
                        {PROVIDER_SHORT[p] || p}
                      </button>
                    );
                  })}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { setStatusFilter([]); setProviderFilter([]); setPage(1); }} className="mt-3 text-xs text-accent-red bg-transparent border-0 cursor-pointer font-sans p-0">
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="border-b border-border-primary">
                  {['Patient', 'Date', 'Procedure', 'Doctor', 'Insurance Provider', 'Total', 'Status', 'Patient Due'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRecords.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-text-tertiary text-sm">No records match your search or filters.</td></tr>
                ) : pagedRecords.map((r, i) => (
                  <motion.tr key={r.id} onClick={() => setSelectedRecordId(r.id)}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className={cn('cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary', i < pagedRecords.length - 1 && 'border-b border-border-primary')}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={r.patientAvatar} size={28} radius="50%" />
                        <span className="font-medium text-text-primary whitespace-nowrap">{r.patientName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{new Date(r.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-3 py-3 text-text-secondary max-w-[200px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">{r.procedure}</p>
                      <p className="text-[11px] text-text-tertiary mt-[2px]">{r.department}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{r.doctor}</td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{PROVIDER_SHORT[r.insuranceProvider] || r.insuranceProvider}</td>
                    <td className="px-3 py-3 font-semibold text-text-primary whitespace-nowrap">₹{r.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] font-semibold px-[10px] py-1 rounded-[8px] whitespace-nowrap" style={{ background: CLAIM_STATUS_COLORS[r.claimStatus].bg, color: CLAIM_STATUS_COLORS[r.claimStatus].color }}>{r.claimStatus}</span>
                    </td>
                    <td className={cn('px-3 py-3 font-semibold whitespace-nowrap', r.patientDue > 50000 ? 'text-accent-red' : 'text-text-primary')}>
                      ₹{r.patientDue.toLocaleString('en-IN')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
              <span className="text-[13px] text-text-secondary">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-[6px]">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-border-primary bg-bg-secondary text-text-secondary cursor-pointer disabled:cursor-not-allowed disabled:text-text-tertiary">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('flex items-center justify-center min-w-[32px] h-8 rounded-[8px] text-[13px] cursor-pointer font-sans border', p === safePage ? 'border-accent-blue bg-[rgba(60,131,246,0.1)] text-accent-blue font-semibold' : 'border-border-primary bg-bg-secondary text-text-secondary')}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-border-primary bg-bg-secondary text-text-secondary cursor-pointer disabled:cursor-not-allowed disabled:text-text-tertiary">
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center z-[1000] p-5"
            onClick={() => setSelectedRecordId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-card rounded-[24px] p-8 w-full max-w-[540px] max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar initials={selectedRecord.patientAvatar} size={44} radius="50%" />
                  <div>
                    <p className="text-[17px] font-bold text-text-primary">{selectedRecord.patientName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-[2px] rounded-[6px] bg-[rgba(60,131,246,0.1)] text-accent-blue font-medium">{selectedRecord.department}</span>
                      <span className="text-[11px] text-text-tertiary">{selectedRecord.policyNumber}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedRecordId(null)} className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-border-primary bg-transparent text-text-secondary cursor-pointer shrink-0">
                  <X size={16} />
                </button>
              </div>

              {/* Visit info */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary">
                  <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">Visit Date</p>
                  <p className="text-sm font-semibold text-text-primary">{new Date(selectedRecord.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary">
                  <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">Doctor</p>
                  <p className="text-sm font-semibold text-text-primary">{selectedRecord.doctor}</p>
                </div>
              </div>

              {/* Procedure */}
              <div className="p-3 rounded-12 bg-bg-secondary border border-border-primary mb-5">
                <p className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1">Procedure</p>
                <p className="text-sm font-medium text-text-primary">{selectedRecord.procedure}</p>
                <p className="text-[11px] text-text-tertiary mt-1">{selectedRecord.insuranceProvider}</p>
              </div>

              {/* Financial breakdown */}
              <div className="grid grid-cols-3 gap-[10px] mb-5">
                {[
                  { label: 'Total Billed',  value: `₹${selectedRecord.totalAmount.toLocaleString('en-IN')}`,      color: '#3c83f6' },
                  { label: 'Ins. Covered',  value: `₹${selectedRecord.insuranceCovered.toLocaleString('en-IN')}`, color: '#0ea5e9' },
                  { label: 'Patient Due',   value: `₹${selectedRecord.patientDue.toLocaleString('en-IN')}`,       color: selectedRecord.patientDue > 50000 ? '#ef4444' : '#7c3bed' },
                ].map(f => (
                  <div key={f.label} className="px-[10px] py-[14px] rounded-12 bg-bg-secondary text-center" style={{ border: `1px solid ${f.color}30` }}>
                    <p className="text-[10px] text-text-tertiary mb-[6px] uppercase tracking-[0.04em]">{f.label}</p>
                    <p className="text-[15px] font-bold" style={{ color: f.color }}>{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Claim status update */}
              <div className="mb-6">
                <p className="text-[13px] font-semibold text-text-secondary mb-[10px]">Update Claim Status</p>
                <div className="flex gap-2 flex-wrap">
                  {ALL_STATUSES.map(s => {
                    const isActive = selectedRecord.claimStatus === s;
                    return (
                      <button key={s} onClick={() => dispatch(updateClaimStatus({ id: selectedRecord.id, status: s }))}
                        className="px-4 py-[6px] rounded-[10px] text-[13px] cursor-pointer font-sans transition-all duration-150"
                        style={{ border: `1px solid ${isActive ? CLAIM_STATUS_COLORS[s].color : 'var(--border-primary)'}`, background: isActive ? CLAIM_STATUS_COLORS[s].bg : 'transparent', color: isActive ? CLAIM_STATUS_COLORS[s].color : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-[10px] justify-end pt-4 border-t border-border-primary">
                <button onClick={() => setSelectedRecordId(null)} className="px-5 py-[10px] rounded-12 border border-border-primary bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer font-sans">Close</button>
                <button onClick={handleViewProfile} className="px-5 py-[10px] rounded-12 border-0 text-white text-[13px] font-semibold cursor-pointer font-sans" style={{ background: 'var(--gradient-primary)' }}>View Patient Profile</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BillingPage;
