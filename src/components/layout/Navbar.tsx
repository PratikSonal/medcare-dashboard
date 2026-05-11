import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, Search, X, CheckCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleTheme, markAllRead, markNotificationRead } from '@/features/ui/uiSlice';

export function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const { notifications, unreadCount } = useAppSelector(s => s.ui);
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);
  const [showNotifs, setShowNotifs] = useState(false);

  const typeIcons: Record<string, string> = { error: '🚨', info: 'ℹ️', success: '✅', warning: '⚠️' };
  const typeColors: Record<string, string> = {
    error: 'var(--accent-red)', info: 'var(--accent-blue)',
    success: 'var(--accent-green)', warning: 'var(--accent-yellow)',
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const iconBtn: React.CSSProperties = {
    width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', border: 'none',
    background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)',
    transition: 'all 200ms ease', position: 'relative',
  };

  return (
    <motion.header
      animate={{ left: sidebarOpen ? '260px' : '72px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', top: 0, right: 0, zIndex: 40, height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', gap: '16px',
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input
          placeholder="Search patients, doctors..."
          style={{
            width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
            borderRadius: '12px', padding: '8px 16px 8px 36px', fontSize: '14px',
            color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 200ms ease',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={iconBtn}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={iconBtn}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-red)', color: 'white', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', right: 0, top: '48px', width: '320px', borderRadius: '20px', zIndex: 50, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-primary)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {unreadCount > 0 && (
                        <button onClick={() => dispatch(markAllRead())}
                          style={{ fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifs(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => dispatch(markNotificationRead(n.id))}
                        style={{ display: 'flex', gap: '12px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border-primary)', background: !n.read ? 'rgba(60,131,246,0.04)' : 'transparent', transition: 'background 200ms ease' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = !n.read ? 'rgba(60,131,246,0.04)' : 'transparent'}
                      >
                        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>{typeIcons[n.type]}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: typeColors[n.type] }}>{n.title}</p>
                            {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0, marginTop: '4px' }} />}
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>{n.message}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{timeAgo(n.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
