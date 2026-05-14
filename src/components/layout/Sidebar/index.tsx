import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import { toggleSidebar } from "@/features/ui/uiSlice";
import type { RootState } from "@/store";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./Sidebar.module.scss";
import { navItems } from "./constants";

export const Sidebar = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s: RootState) => s.auth.user);
  const sidebarOpen = useAppSelector((s: RootState) => s.ui.sidebarOpen);

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    dispatch(logout());
    navigate("/login");
  };

  const closeSidebar = (): void => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed left-3 top-3 z-50 flex flex-col overflow-hidden",
          "bg-bg-secondary border border-border-primary rounded-20",
          "h-[calc(100vh-24px)] w-60",
          "transition-transform duration-300 ease-in-out",
          // Mobile: slide off-screen when closed, always show on sm+
          sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+16px)]",
          "sm:translate-x-0",
          styles.sidebar,
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-[10px] px-4 py-5 shrink-0">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Activity size={18} color="white" />
          </div>
          <span className="gradient-text text-[17px] font-bold whitespace-nowrap">MedCare</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 flex flex-col gap-[2px] overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="no-underline"
              onClick={(): void => {
                document.documentElement.scrollTop = 0;
                // Close drawer on mobile after navigation
                if (window.innerWidth < 640) closeSidebar();
              }}
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-[10px] rounded-12 cursor-pointer whitespace-nowrap",
                    styles.navItem,
                    isActive && styles.active,
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — user + logout */}
        <div className="p-2 shrink-0 border-t border-border-primary">
          {user && (
            <div className="flex items-center gap-[10px] px-3 py-[10px] mb-1 rounded-12 bg-bg-tertiary">
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              >
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.displayName || "Dr. Admin"}
                </p>
                <p className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-[10px] rounded-12 w-full border-0 bg-transparent cursor-pointer text-text-secondary font-sans",
              styles.logoutBtn,
            )}
          >
            <LogOut size={16} className="shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
