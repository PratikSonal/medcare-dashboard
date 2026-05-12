import { CheckCircle, XCircle, Info } from 'lucide-react';
import type { ToastType } from './types';

export const CONFIG: Record<ToastType, { icon: typeof CheckCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: '#10bc83', bg: 'rgba(16,188,131,0.12)' },
  error:   { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  info:    { icon: Info,        color: '#3c83f6', bg: 'rgba(60,131,246,0.12)' },
};
