import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, BarChart3, Users, LogOut, Activity, Calendar, CreditCard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { logout } from '@/features/auth/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      style={{
        position: 'fixed', left: '12px', top: '12px',
        height: 'calc(100vh - 24px)', width: '240px',
        zIndex: 50, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '20px',
        boxShadow: theme === 'dark'
          ? '4px 0 24px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '4px 0 20px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 16px', flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--gradient-primary)' }}>
          <Activity size={18} color="white" />
        </div>
        <span
          className="gradient-text"
          style={{ fontSize: '17px', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          MedCare
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '12px', cursor: 'pointer',
                  transition: 'all 200ms ease',
                  background: isActive ? 'rgba(60,131,246,0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — user + logout */}
      <div style={{ padding: '8px', flexShrink: 0, borderTop: '1px solid var(--border-primary)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '4px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>
              {user.email?.[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || 'Dr. Admin'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 200ms ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-red)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
