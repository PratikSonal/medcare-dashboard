import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Sun,
  Moon,
  X,
  CheckCheck,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { cn } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleTheme, markAllRead, markNotificationRead, toggleSidebar } from "@/features/ui/uiSlice";
import type { Notification } from "@/features/ui/types";
import styles from "./Navbar.module.scss";
import type { FilterType } from "./types";
import { timeAgo } from "./helpers";
import type { RootState } from "@/store";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  error: { icon: <AlertCircle size={14} />, color: "var(--accent-red)", bg: "rgba(239,68,68,0.12)" },
  info: { icon: <Info size={14} />, color: "var(--accent-blue)", bg: "rgba(60,131,246,0.12)" },
  success: { icon: <CheckCircle size={14} />, color: "var(--accent-cyan)", bg: "rgba(14,165,233,0.12)" },
  warning: { icon: <AlertTriangle size={14} />, color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.12)" },
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const NotificationItem = memo(({ notification, onRead }: NotificationItemProps): React.ReactElement => {
  const handleClick = useCallback(() => onRead(notification.id), [notification.id, onRead]);
  const config = typeConfig[notification.type];

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-3 px-4 py-3 items-start border-b border-border-primary",
        styles.notifItem,
        !notification.read && "bg-[rgba(60,131,246,0.04)]",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0",
          styles.iconBox,
        )}
        style={
          {
            "--notif-color": config.color,
            background: config.bg,
            color: config.color,
          } as React.CSSProperties
        }
      >
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold mb-[2px]" style={{ color: config.color }}>
            {notification.title}
          </p>
          {!notification.read && (
            <div className="w-[7px] h-[7px] rounded-full bg-accent-blue shrink-0 mt-[3px]" />
          )}
        </div>
        <p className="text-xs text-text-secondary leading-[1.5]">{notification.message}</p>
        <p className="text-[11px] text-text-tertiary mt-1">{timeAgo(notification.timestamp)}</p>
      </div>
    </div>
  );
});

interface FilterTabProps {
  filterType: FilterType;
  isActive: boolean;
  label: string;
  onFilterClick: (filter: FilterType) => void;
}

const FilterTab = memo(({ filterType, isActive, label, onFilterClick }: FilterTabProps): React.ReactElement => {
  const handleClick = useCallback(() => onFilterClick(filterType), [filterType, onFilterClick]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(styles.filterTab, isActive && styles.active)}
    >
      {label}
    </button>
  );
});

export const Navbar = memo((): React.ReactElement => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s: RootState) => s.ui.theme);
  const { notifications, unreadCount } = useAppSelector((s: RootState) => s.ui);
  const user = useAppSelector((s: RootState) => s.auth.user);
  const [showNotifs, setShowNotifs] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const visible = filter === "unread" ? notifications.filter(n => !n.read) : notifications;
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Doctor";
  const initial = displayName[0].toUpperCase();

  const handleToggleSidebar = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const handleToggleTheme = useCallback(() => dispatch(toggleTheme()), [dispatch]);
  const handleToggleNotifs = useCallback(() => setShowNotifs(v => !v), []);
  const handleMarkAllRead = useCallback(() => dispatch(markAllRead()), [dispatch]);
  const handleCloseNotifs = useCallback(() => setShowNotifs(false), []);
  const handleSetFilter = useCallback((f: FilterType) => setFilter(f), []);
  const handleNotifRead = useCallback((id: string) => dispatch(markNotificationRead(id)), [dispatch]);

  return (
    <motion.header
      className={cn(
        "fixed top-[14px] right-5 z-40 flex items-center justify-between gap-2",
        "left-4 sm:left-[284px]",
        "bg-bg-card border border-border-primary rounded-full h-12",
        "px-4 backdrop-blur-md transition-[background,border-color,box-shadow] duration-[400ms]",
        styles.navbar,
      )}
    >
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={handleToggleSidebar}
        className="sm:hidden bg-transparent border-0 cursor-pointer text-text-secondary flex items-center p-0 shrink-0"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Welcome section */}
      <div className="flex items-center gap-[10px]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 [background:var(--gradient-primary)]"
        >
          {initial}
        </motion.div>
        <div className="flex items-center gap-[5px]">
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="text-[13px] text-text-secondary"
          >
            Welcome,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.32 }}
            className="text-[13px] font-semibold text-text-primary"
          >
            {displayName}
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={handleToggleTheme}
          className={styles.iconBtn}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleNotifs}
            className={styles.iconBtn}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <span className={unreadCount > 0 ? styles.bellRing : undefined}>
              <Bell size={15} />
            </span>
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
                <div className="fixed inset-0 z-40" onClick={handleCloseNotifs} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-11 w-80 rounded-16 z-50 overflow-hidden bg-bg-secondary border border-border-primary shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-[14px]">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-xs text-accent-blue bg-transparent border-0 cursor-pointer flex items-center gap-1 font-sans whitespace-nowrap"
                        >
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCloseNotifs}
                        className="bg-transparent border-0 cursor-pointer text-text-tertiary flex"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex px-4 pt-2 border-b border-border-primary">
                    {(["all", "unread"] as const).map(filterType => (
                      <FilterTab
                        key={filterType}
                        filterType={filterType}
                        isActive={filter === filterType}
                        label={
                          filterType === "all"
                            ? "All"
                            : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`
                        }
                        onFilterClick={handleSetFilter}
                      />
                    ))}
                  </div>

                  {/* List */}
                  <div className={cn("max-h-80 overflow-y-auto", styles.noScrollbar)}>
                    {visible.length === 0 ? (
                      <div className="py-8 px-4 text-center text-text-tertiary text-[13px]">
                        No unread notifications
                      </div>
                    ) : (
                      visible.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onRead={handleNotifRead}
                        />
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
});
