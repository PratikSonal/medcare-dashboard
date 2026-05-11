import { useState } from "react";
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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  toggleTheme,
  markAllRead,
  markNotificationRead,
} from "@/features/ui/uiSlice";

export function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const { notifications, unreadCount } = useAppSelector((s) => s.ui);
  const [showNotifs, setShowNotifs] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const typeConfig: Record<
    string,
    { icon: React.ReactNode; color: string; bg: string }
  > = {
    error: {
      icon: <AlertCircle size={14} />,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
    },
    info: {
      icon: <Info size={14} />,
      color: "#3c83f6",
      bg: "rgba(60,131,246,0.12)",
    },
    success: {
      icon: <CheckCircle size={14} />,
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.12)",
    },
    warning: {
      icon: <AlertTriangle size={14} />,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const visible =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const iconBtn: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-secondary)",
    transition: "all 200ms ease",
    position: "relative",
    flexShrink: 0,
  };

  return (
    <motion.header
      style={{
        left: "284px",
        position: "fixed",
        top: "14px",
        right: "20px",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 16px 6px 16px",
        gap: "8px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-primary)",
        borderRadius: "999px",
        boxShadow:
          theme === "dark"
            ? "0 2px 8px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        height: "48px",
        transition:
          "background 400ms ease, border-color 400ms ease, box-shadow 400ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginLeft: "auto",
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={iconBtn}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--bg-tertiary)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={iconBtn}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--bg-tertiary)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-secondary)";
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "var(--accent-red)",
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                  onClick={() => setShowNotifs(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "44px",
                    width: "320px",
                    borderRadius: "16px",
                    zIndex: 50,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  {/* Header row 1: title + actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px 0",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      Notifications
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {unreadCount > 0 && (
                        <button
                          onClick={() => dispatch(markAllRead())}
                          style={{
                            fontSize: "12px",
                            color: "var(--accent-blue)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "inherit",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifs(false)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-tertiary)",
                          display: "flex",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Header row 2: filter tabs */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0",
                      padding: "8px 16px 0",
                      borderBottom: "1px solid var(--border-primary)",
                    }}
                  >
                    {(["all", "unread"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                          padding: "6px 12px",
                          border: "none",
                          borderBottom: `2px solid ${filter === f ? "var(--accent-blue)" : "transparent"}`,
                          background: "transparent",
                          color:
                            filter === f
                              ? "var(--accent-blue)"
                              : "var(--text-tertiary)",
                          fontSize: "12px",
                          fontWeight: filter === f ? 600 : 400,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 150ms ease",
                        }}
                      >
                        {f === "all"
                          ? "All"
                          : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
                      </button>
                    ))}
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                    {visible.length === 0 ? (
                      <div
                        style={{
                          padding: "32px 16px",
                          textAlign: "center",
                          color: "var(--text-tertiary)",
                          fontSize: "13px",
                        }}
                      >
                        No unread notifications
                      </div>
                    ) : (
                      visible.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => dispatch(markNotificationRead(n.id))}
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "12px 16px",
                            cursor: "pointer",
                            borderBottom: "1px solid var(--border-primary)",
                            background: !n.read
                              ? "rgba(60,131,246,0.04)"
                              : "transparent",
                            transition: "background 200ms ease",
                            alignItems: "flex-start",
                          }}
                          onMouseEnter={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = "var(--bg-tertiary)")
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = !n.read
                              ? "rgba(60,131,246,0.04)"
                              : "transparent")
                          }
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: typeConfig[n.type].bg,
                              color: typeConfig[n.type].color,
                              flexShrink: 0,
                            }}
                          >
                            {typeConfig[n.type].icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: "8px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: typeConfig[n.type].color,
                                  marginBottom: "2px",
                                }}
                              >
                                {n.title}
                              </p>
                              {!n.read && (
                                <div
                                  style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    background: "var(--accent-blue)",
                                    flexShrink: 0,
                                    marginTop: "3px",
                                  }}
                                />
                              )}
                            </div>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                lineHeight: 1.5,
                              }}
                            >
                              {n.message}
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "var(--text-tertiary)",
                                marginTop: "4px",
                              }}
                            >
                              {timeAgo(n.timestamp)}
                            </p>
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
