import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CreditCard, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockBillingData } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSelectedPatient } from '@/features/patients/patientsSlice';
import type { ClaimStatus } from '@/types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ttStyle = { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'Poppins', fontSize: '12px' } };

const claimColors: Record<ClaimStatus, string> = {
  Approved: '#0ea5e9',
  Partial: '#7c3bed',
  Pending: '#f59e0b',
  Denied: '#ef4444',
};

const claimBg: Record<ClaimStatus, string> = {
  Approved: 'rgba(14,165,233,0.1)',
  Partial: 'rgba(124,59,237,0.1)',
  Pending: 'rgba(245,158,11,0.1)',
  Denied: 'rgba(239,68,68,0.1)',
};

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${(n / 1000).toFixed(1)}K`;

const providerShort: Record<string, string> = {
  'Star Health Insurance': 'Star Health',
  'HDFC ERGO Health': 'HDFC ERGO',
  'Bajaj Allianz Health': 'Bajaj Allianz',
  'Niva Bupa Health': 'Niva Bupa',
  'New India Assurance': 'New India',
  'ICICI Lombard Health': 'ICICI Lombard',
  'United India Insurance': 'United India',
};

export default function BillingPage() {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);

  const totalBilled = mockBillingData.reduce((s, r) => s + r.totalAmount, 0);
  const insuranceCovered = mockBillingData.reduce((s, r) => s + r.insuranceCovered, 0);
  const patientDue = mockBillingData.reduce((s, r) => s + r.patientDue, 0);
  const pendingRecords = mockBillingData.filter(r => r.claimStatus === 'Pending');
  const pendingAmount = pendingRecords.reduce((s, r) => s + r.totalAmount, 0);

  const claimStatusData = [
    { name: 'Approved', value: mockBillingData.filter(r => r.claimStatus === 'Approved').length, color: '#0ea5e9' },
    { name: 'Partial', value: mockBillingData.filter(r => r.claimStatus === 'Partial').length, color: '#7c3bed' },
    { name: 'Pending', value: mockBillingData.filter(r => r.claimStatus === 'Pending').length, color: '#f59e0b' },
    { name: 'Denied', value: mockBillingData.filter(r => r.claimStatus === 'Denied').length, color: '#ef4444' },
  ];

  const providerMap: Record<string, { approved: number; partial: number; pending: number; denied: number }> = {};
  mockBillingData.forEach(r => {
    const name = providerShort[r.insuranceProvider] || r.insuranceProvider;
    if (!providerMap[name]) providerMap[name] = { approved: 0, partial: 0, pending: 0, denied: 0 };
    const key = r.claimStatus.toLowerCase() as 'approved' | 'partial' | 'pending' | 'denied';
    providerMap[name][key]++;
  });
  const providerData = Object.entries(providerMap).map(([name, counts]) => ({ name, ...counts }));

  const kpis = [
    { title: 'Total Billed', value: fmt(totalBilled), sub: `${mockBillingData.length} records`, icon: <CreditCard size={20} />, color: '#3c83f6' },
    { title: 'Insurance Settled', value: fmt(insuranceCovered), sub: `${Math.round((insuranceCovered / totalBilled) * 100)}% of total`, icon: <CheckCircle size={20} />, color: '#0ea5e9' },
    { title: 'Patient Outstanding', value: fmt(patientDue), sub: 'Across all visits', icon: <TrendingUp size={20} />, color: '#7c3bed' },
    { title: 'Pending Claims', value: `${pendingRecords.length}`, sub: fmt(pendingAmount) + ' at risk', icon: <Clock size={20} />, color: '#f59e0b' },
  ];

  const handleRowClick = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) dispatch(setSelectedPatient(patient));
  };

  return (
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

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '24px' }}>

        {/* Provider Performance */}
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Provider Performance</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Claims by status per insurance provider</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
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
        </motion.div>

        {/* Claim Status Donut */}
        <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Claim Status</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{mockBillingData.length} total claims</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={claimStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {claimStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...ttStyle} formatter={(v) => [`${v} claims`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {claimStatusData.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{Math.round((s.value / mockBillingData.length) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Billing Table */}
      <motion.div variants={item} className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Billing Records</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Click any row to view patient profile</p>
          </div>
        </div>
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
              {mockBillingData.map((r, i) => (
                <tr key={r.id}
                  onClick={() => handleRowClick(r.patientId)}
                  style={{ borderBottom: i < mockBillingData.length - 1 ? '1px solid var(--border-primary)' : 'none', transition: 'background 200ms ease', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', background: 'var(--gradient-primary)', flexShrink: 0 }}>{r.patientAvatar}</div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{r.patientName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(r.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.procedure}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{r.department}</p>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.doctor}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{providerShort[r.insuranceProvider] || r.insuranceProvider}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>₹{r.totalAmount.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap', background: claimBg[r.claimStatus], color: claimColors[r.claimStatus] }}>{r.claimStatus}</span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, whiteSpace: 'nowrap', color: r.patientDue > 50000 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    ₹{r.patientDue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
