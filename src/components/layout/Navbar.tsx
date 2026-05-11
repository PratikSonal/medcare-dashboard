import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, X, CheckCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleTheme, markAllRead, markNotificationRead } from '@/features/ui/uiSlice';

export function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const { notifications, unreadCount } = useAppSelector(s => s.ui);
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
    width: '32px', height: '32px', borderRadius: '8px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', border: 'none',
    background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)',
    transition: 'all 200ms ease', position: 'relative', flexShrink: 0,
  };

  return (
    <motion.header
      style={{
        left: '284px',
        position: 'fixed', top: '14px', right: '20px', zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 16px 6px 16px', gap: '8px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '999px',
        boxShadow: theme === 'dark'
          ? '0 2px 8px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        height: '48px',
        transition: 'background 400ms ease, border-color 400ms ease, box-shadow 400ms ease',
      }}
    >
      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={iconBtn}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={iconBtn}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-3px', right: '-3px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent-red)', color: 'white', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                  style={{ position: 'absolute', right: 0, top: '44px', width: '320px', borderRadius: '16px', zIndex: 50, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
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
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div key={n.id} onClick={() => dispatch(markNotificationRead(n.id))}
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
