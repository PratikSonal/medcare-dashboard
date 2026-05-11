import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BarChart3, Users, LogOut, Activity, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleSidebar } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)' }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', height: '64px', borderBottom: '1px solid var(--border-primary)', flexShrink: 0 }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--gradient-primary)' }}>
          <Activity size={18} color="white" />
        </motion.div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              className="gradient-text" style={{ fontSize: '18px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              MedCare
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 200ms ease', background: isActive ? 'rgba(60,131,246,0.12)' : 'transparent', border: isActive ? '1px solid rgba(60,131,246,0.2)' : '1px solid transparent', color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-primary)', flexShrink: 0 }}>
        <AnimatePresence>
          {sidebarOpen && user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '8px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0, background: 'var(--gradient-primary)' }}>
                {user.email?.[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'Dr. Admin'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 200ms ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-red)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>Logout</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle */}
      <button onClick={() => dispatch(toggleSidebar())}
        style={{ position: 'absolute', right: '-12px', top: '80px', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, border: 'none', cursor: 'pointer', background: 'var(--accent-blue)', color: 'white', boxShadow: 'var(--glow-blue)', transition: 'transform 200ms ease' }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </motion.aside>
  );
}
