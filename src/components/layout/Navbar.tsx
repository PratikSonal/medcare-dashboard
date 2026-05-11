import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sun, Moon, X, CheckCheck, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleTheme, markAllRead, markNotificationRead } from "@/features/ui/uiSlice";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const { notifications, unreadCount } = useAppSelector((s) => s.ui);
  const [showNotifs, setShowNotifs] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    error:   { icon: <AlertCircle size={14} />,   color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    info:    { icon: <Info size={14} />,           color: "#3c83f6", bg: "rgba(60,131,246,0.12)" },
    success: { icon: <CheckCircle size={14} />,    color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
    warning: { icon: <AlertTriangle size={14} />,  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <motion.header
      className={cn(
        "fixed top-[14px] right-5 z-40 flex items-center justify-between gap-2",
        "bg-bg-card border border-border-primary rounded-full h-12",
        "px-4 backdrop-blur-md transition-[background,border-color,box-shadow] duration-[400ms]",
        styles.navbar,
      )}
      style={{ left: "284px" }}
    >
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button onClick={() => dispatch(toggleTheme())} className={styles.iconBtn}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className={styles.iconBtn}>
            <Bell size={15} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-[3px] -right-[3px] w-[14px] h-[14px] rounded-full bg-accent-red text-white text-[9px] font-bold flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-11 w-80 rounded-16 z-50 overflow-hidden bg-bg-secondary border border-border-primary shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  {/* Header: title + actions */}
                  <div className="flex items-center justify-between px-4 pt-[14px]">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => dispatch(markAllRead())}
                          className="text-xs text-accent-blue bg-transparent border-0 cursor-pointer flex items-center gap-1 font-sans whitespace-nowrap"
                        >
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifs(false)} className="bg-transparent border-0 cursor-pointer text-text-tertiary flex">
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex px-4 pt-2 border-b border-border-primary">
                    {(["all", "unread"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(styles.filterTab, filter === f && styles.active)}
                      >
                        {f === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
                      </button>
                    ))}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {visible.length === 0 ? (
                      <div className="py-8 px-4 text-center text-text-tertiary text-[13px]">
                        No unread notifications
                      </div>
                    ) : (
                      visible.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => dispatch(markNotificationRead(n.id))}
                          className={cn("flex gap-3 px-4 py-3 items-start border-b border-border-primary", styles.notifItem)}
                          style={{ background: !n.read ? "rgba(60,131,246,0.04)" : "transparent" }}
                        >
                          <div
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                            style={{ background: typeConfig[n.type].bg, color: typeConfig[n.type].color }}
                          >
                            {typeConfig[n.type].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold mb-[2px]" style={{ color: typeConfig[n.type].color }}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <div className="w-[7px] h-[7px] rounded-full bg-accent-blue shrink-0 mt-[3px]" />
                              )}
                            </div>
                            <p className="text-xs text-text-secondary leading-[1.5]">{n.message}</p>
                            <p className="text-[11px] text-text-tertiary mt-1">{timeAgo(n.timestamp)}</p>
                          </div>
                        </div>
                      ))
                    )}
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
