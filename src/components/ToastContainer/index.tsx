import { AnimatePresence,motion } from "framer-motion";
import { X } from "lucide-react";
import { memo, useCallback, useEffect } from "react";

import { removeToast } from "@/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";

import { CONFIG, TOAST_DISMISS_MS } from "./constants";
import type { ToastProps } from "./types";

const Toast = memo(({ id, message, type }: ToastProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { icon: Icon, color, bg } = CONFIG[type];

  const handleDismiss = useCallback(() => dispatch(removeToast(id)), [id, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), TOAST_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center gap-[10px] px-[14px] py-3 rounded-[14px] bg-bg-card border border-border-primary shadow-[0_8px_24px_rgba(0,0,0,0.18)] max-w-[320px] min-w-[240px]"
    >
      <div
        className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0"
        style={{ background: bg, color }}
      >
        <Icon size={16} />
      </div>
      <p className="flex-1 text-[13px] font-medium text-text-primary leading-[1.4]">{message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="p-[2px] border-0 bg-transparent cursor-pointer text-text-tertiary flex shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
});

export const ToastContainer = memo((): React.ReactElement => {
  const toasts = useAppSelector((s: RootState) => s.ui.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[1100] flex flex-col-reverse gap-2 items-end">
      <AnimatePresence>
        {toasts.map((toast: ToastProps) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
});
