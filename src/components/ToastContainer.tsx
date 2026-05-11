import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { removeToast } from '@/features/ui/uiSlice';

const CONFIG = {
  success: { icon: CheckCircle, color: '#10bc83', bg: 'rgba(16,188,131,0.12)' },
  error:   { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  info:    { icon: Info,        color: '#3c83f6', bg: 'rgba(60,131,246,0.12)' },
};

function Toast({ id, message, type }: { id: string; message: string; type: 'success' | 'error' | 'info' }) {
  const dispatch = useAppDispatch();
  const { icon: Icon, color, bg } = CONFIG[type];

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), 3500);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', maxWidth: '320px', minWidth: '240px' }}>
      <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color, flexShrink: 0 }}>
        <Icon size={16} />
      </div>
      <p style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{message}</p>
      <button onClick={() => dispatch(removeToast(id))}
        style={{ padding: '2px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useAppSelector(s => s.ui.toasts);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1100, display: 'flex', flexDirection: 'column-reverse', gap: '8px', alignItems: 'flex-end' }}>
      <AnimatePresence>
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </AnimatePresence>
    </div>
  );
}
