import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  Phone,
  X,
  UserX,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";
import type { AppointmentStatus, Appointment } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient } from "@/features/patients/patientsSlice";
import {
  updateAppointmentStatus,
  updateAppointmentChecks,
} from "@/features/appointments/appointmentsSlice";
import { addToast } from "@/features/ui/uiSlice";
import NewAppointmentModal from "@/components/NewAppointmentModal";
import { APPT_STATUS_COLORS, APPT_TYPE_COLORS } from "@/lib/constants";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { KpiCard } from "@/components/ui/KpiCard";
import { cn } from "@/lib/utils";
import { container, item, ALL_STATUSES, DAY_NAMES } from "./constants";
import { getWeekDays, formatDateKey } from "./helpers";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  Confirmed: {
    ...APPT_STATUS_COLORS.Confirmed,
    icon: <CheckCircle size={13} />,
    label: "Confirmed",
  },
  Pending: {
    ...APPT_STATUS_COLORS.Pending,
    icon: <AlertCircle size={13} />,
    label: "Pending",
  },
  Completed: {
    ...APPT_STATUS_COLORS.Completed,
    icon: <CheckCircle size={13} />,
    label: "Completed",
  },
  Cancelled: {
    ...APPT_STATUS_COLORS.Cancelled,
    icon: <XCircle size={13} />,
    label: "Cancelled",
  },
  "No-Show": {
    ...APPT_STATUS_COLORS["No-Show"],
    icon: <XCircle size={13} />,
    label: "No-Show",
  },
};

const AppointmentsPage = () => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector((s) => s.patients.patients);
  const appointments = useAppSelector((s) => s.appointments.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-11"));
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);

  const baseDate = new Date("2026-05-11");
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(baseDate);

  const dateKey = formatDateKey(selectedDate);
  const todayApps = appointments
    .filter((a) => {
      if (a.date !== dateKey) return false;
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (filterType !== "All" && a.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.patientName.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.clinicName.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.insuranceProvider.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const hasActiveFilters = filterStatus !== "All" || filterType !== "All";
  const clearFilters = () => {
    setFilterStatus("All");
    setFilterType("All");
  };

  const todayAll = appointments
    .filter((a) => a.date === dateKey)
    .sort((a, b) => a.time.localeCompare(b.time));
  const doctors = [...new Set(appointments.map((a) => a.doctor))];

  const stats = [
    {
      label: "Total Today",
      value: todayAll.length,
      color: "#3c83f6",
      icon: <Calendar size={20} />,
      desc: "All scheduled visits",
      filter: "All",
    },
    {
      label: "Confirmed",
      value: todayAll.filter((a) => a.status === "Confirmed").length,
      color: "#0ea5e9",
      icon: <CheckCircle size={20} />,
      desc: "Ready to proceed",
      filter: "Confirmed",
    },
    {
      label: "Pending",
      value: todayAll.filter((a) => a.status === "Pending").length,
      color: "#f59e0b",
      icon: <AlertCircle size={20} />,
      desc: "Awaiting confirmation",
      filter: "Pending",
    },
    {
      label: "No-Shows",
      value: todayAll.filter((a) => a.status === "No-Show").length,
      color: "#ef4444",
      icon: <XCircle size={20} />,
      desc: "Did not attend",
      filter: "No-Show",
    },
  ];

  const handleViewPatient = () => {
    if (!selectedApp) return;
    const patient = patients.find((p) => p.id === selectedApp.patientId);
    if (patient) dispatch(setSelectedPatient(patient));
    setSelectedApp(null);
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">
              Appointments
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {todayApps.length} appointments on{" "}
              {selectedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <motion.button
            onClick={() => setShowNewAppModal(true)}
            whileHover="hover"
            initial="rest"
            className="flex items-center gap-2 py-[10px] px-5 rounded-[12px] border-0 text-white font-semibold cursor-pointer font-sans text-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <motion.span
              variants={{ rest: { scale: 1 }, hover: { scale: 1.2, transition: { duration: 0.2, ease: 'easeOut' } } }}
              style={{ display: 'inline-flex' }}
            >
              <Plus size={16} />
            </motion.span>
            New Appointment
          </motion.button>
        </div>
        <div className="glow-line mt-5" />
      </motion.div>

      {/* Daily Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-3 mb-6"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <KpiCard
              size="sm"
              title={s.label}
              rawValue={s.value}
              sub={s.desc}
              icon={s.icon}
              color={s.color}
              active={filterStatus === s.filter}
              onClick={() => setFilterStatus(s.filter)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "24px",
        }}
      >
        {/* Left — Calendar + List */}
        <div>
          {/* Week strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-20 p-5 mb-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-text-primary">
                {baseDate.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setWeekOffset((w) => w - 1)}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border-primary bg-bg-tertiary cursor-pointer text-text-secondary"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border-primary bg-bg-tertiary cursor-pointer text-text-secondary"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => {
                const key = formatDateKey(day);
                const isSelected = key === formatDateKey(selectedDate);
                const appCount = appointments.filter(
                  (a) => a.date === key,
                ).length;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedDate(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex flex-col items-center gap-[6px] py-3 px-2 rounded-[14px] border cursor-pointer transition-all duration-200 font-sans",
                      isSelected
                        ? "border-accent-blue bg-[rgba(60,131,246,0.15)]"
                        : "border-transparent bg-bg-tertiary",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        isSelected ? "text-accent-blue" : "text-text-tertiary",
                      )}
                    >
                      {DAY_NAMES[i]}
                    </span>
                    <span
                      className={cn(
                        "text-[18px] font-bold",
                        isSelected ? "text-accent-blue" : "text-text-primary",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    {appCount > 0 && (
                      <span
                        className="text-[9px] font-bold leading-none py-[2px] px-[5px] rounded-full text-white"
                        style={{
                          background: isSelected
                            ? "#3c83f6"
                            : appCount >= 6
                              ? "#ef4444"
                              : appCount >= 4
                                ? "#f59e0b"
                                : "#0ea5e9",
                        }}
                      >
                        {appCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Search + Filter bar */}
          <div className="mb-4">
            <div className="flex gap-[10px] items-center">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by patient, doctor, type, clinic, insurance…"
              />
              <button
                onClick={() => setShowFilters((f) => !f)}
                className={cn(
                  "flex items-center gap-[7px] py-[10px] px-4 rounded-[12px] text-[13px] font-medium border cursor-pointer font-sans whitespace-nowrap",
                  hasActiveFilters
                    ? "border-[rgba(60,131,246,0.4)] bg-[rgba(60,131,246,0.1)] text-accent-blue"
                    : "border-border-primary bg-bg-secondary text-text-secondary",
                )}
              >
                <Filter size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="text-[10px] font-bold py-[1px] px-[6px] rounded-full bg-accent-blue text-white">
                    ON
                  </span>
                )}
                <ChevronDown
                  size={14}
                  style={{
                    transition: "transform 200ms",
                    transform: showFilters ? "rotate(180deg)" : "none",
                  }}
                />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-[5px] py-[10px] px-3 rounded-[12px] text-xs font-medium border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans"
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, marginTop: 0 }}
                  animate={{ opacity: 1, maxHeight: 200, marginTop: 10 }}
                  exit={{ opacity: 0, maxHeight: 0, marginTop: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="glass-card rounded-[16px] p-5 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[10px]">
                        Status
                      </p>
                      <div className="flex flex-wrap gap-[6px]">
                        {["All", ...ALL_STATUSES].map((s) => (
                          <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={cn(
                              "py-[5px] px-3 rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-150 border-0",
                              filterStatus === s
                                ? "bg-accent-blue text-white"
                                : "bg-bg-tertiary text-text-secondary",
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[10px]">
                        Appointment Type
                      </p>
                      <div className="flex flex-wrap gap-[6px]">
                        {["All", ...Object.keys(APPT_TYPE_COLORS)].map((t) => (
                          <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className="py-[5px] px-3 rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-150 border-0"
                            style={{
                              background:
                                filterType === t
                                  ? (APPT_TYPE_COLORS[t] ??
                                    "var(--accent-blue)")
                                  : "var(--bg-tertiary)",
                              color:
                                filterType === t
                                  ? "white"
                                  : "var(--text-secondary)",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Appointment list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={dateKey + filterStatus}
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-[10px]"
            >
              {todayApps.length === 0 ? (
                <motion.div
                  variants={item}
                  className="text-center py-12 text-text-tertiary"
                >
                  <Calendar size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="text-[15px] font-medium">
                    No appointments for this day
                  </p>
                </motion.div>
              ) : (
                todayApps.map((app) => {
                  const status = STATUS_CONFIG[app.status];
                  const typeColor =
                    APPT_TYPE_COLORS[app.type] || "var(--accent-blue)";
                  return (
                    <motion.div
                      key={app.id}
                      variants={item}
                      onClick={() => setSelectedApp(app)}
                      whileHover={{ x: 4, transition: { duration: 0.15 } }}
                      className="glass-card rounded-[16px] p-4 cursor-pointer"
                      style={{ borderLeft: `3px solid ${typeColor}` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-center min-w-[48px]">
                            <p className="text-[15px] font-bold text-text-primary">
                              {app.time}
                            </p>
                            <p className="text-[10px] text-text-tertiary mt-[2px]">
                              {app.duration}min
                            </p>
                          </div>
                          <div className="w-px h-10 bg-border-primary shrink-0" />
                          <Avatar
                            initials={app.patientAvatar}
                            size={36}
                            radius="50%"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-text-primary">
                                {app.patientName}
                              </p>
                              <span
                                className="text-[10px] py-[2px] px-2 rounded-full font-medium"
                                style={{
                                  background: `${typeColor}18`,
                                  color: typeColor,
                                  border: `1px solid ${typeColor}30`,
                                }}
                              >
                                {app.type}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mt-[2px]">
                              {app.doctor} · {app.department}
                            </p>
                            <div className="flex items-center gap-1 mt-[3px]">
                              <Phone size={10} className="text-text-tertiary" />
                              <p className="text-[11px] text-text-tertiary">
                                {app.phone}
                              </p>
                            </div>
                            {app.notes && (
                              <p className="text-[11px] text-accent-yellow mt-1">
                                ⚠️ {app.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className="flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-[8px]"
                            style={{
                              background: status.bg,
                              color: status.color,
                            }}
                          >
                            {status.icon} {status.label}
                          </span>
                          {(app.status === "Pending" ||
                            app.status === "Confirmed") && (
                            <div className="flex gap-1">
                              {app.status === "Pending" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      updateAppointmentStatus({
                                        id: app.id,
                                        status: "Confirmed",
                                      }),
                                    );
                                    dispatch(
                                      addToast({
                                        message: `Appointment for ${app.patientName} confirmed.`,
                                        type: "success",
                                      }),
                                    );
                                  }}
                                  className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(14,165,233,0.35)] bg-[rgba(14,165,233,0.1)] text-[#0ea5e9] cursor-pointer font-sans"
                                >
                                  <CheckCircle size={10} /> Confirm
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    updateAppointmentStatus({
                                      id: app.id,
                                      status: "No-Show",
                                    }),
                                  );
                                  dispatch(
                                    addToast({
                                      message: `${app.patientName} marked as no-show.`,
                                      type: "info",
                                    }),
                                  );
                                }}
                                className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(107,114,128,0.3)] bg-[rgba(107,114,128,0.08)] text-text-tertiary cursor-pointer font-sans"
                              >
                                <UserX size={10} /> No-show
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    updateAppointmentStatus({
                                      id: app.id,
                                      status: "Cancelled",
                                    }),
                                  );
                                  dispatch(
                                    addToast({
                                      message: `Appointment for ${app.patientName} cancelled.`,
                                      type: "error",
                                    }),
                                  );
                                }}
                                className="flex items-center gap-[3px] py-[3px] px-2 rounded-[6px] text-[10px] font-semibold border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] text-[#ef4444] cursor-pointer font-sans"
                              >
                                <XCircle size={10} /> Cancel
                              </button>
                            </div>
                          )}
                          <div className="flex gap-[6px]">
                            <span
                              className={cn(
                                "text-[10px] py-[2px] px-[6px] rounded-[6px]",
                                app.intakeComplete
                                  ? "bg-[rgba(14,165,233,0.1)] text-[#0ea5e9] border border-[rgba(14,165,233,0.2)]"
                                  : "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]",
                              )}
                            >
                              {app.intakeComplete ? "✓ Intake" : "⏳ Intake"}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] py-[2px] px-[6px] rounded-[6px]",
                                app.insuranceVerified
                                  ? "bg-[rgba(14,165,233,0.1)] text-[#0ea5e9] border border-[rgba(14,165,233,0.2)]"
                                  : "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]",
                              )}
                            >
                              {app.insuranceVerified
                                ? "✓ Insured"
                                : "✗ Insurance"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Doctor schedules */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-20 p-5"
          >
            <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User size={15} className="text-accent-blue" /> Doctor Schedules
            </h3>
            <div className="flex flex-col gap-[10px]">
              {doctors.map((doc) => {
                const docApps = todayAll.filter((a) => a.doctor === doc);
                const confirmed = docApps.filter(
                  (a) => a.status === "Confirmed",
                ).length;
                return (
                  <motion.div
                    key={doc}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className="flex items-center justify-between py-[10px] px-3 rounded-[12px] bg-bg-tertiary"
                  >
                    <div className="flex items-center gap-[10px]">
                      <Avatar
                        initials={doc.split(" ").slice(-1)[0][0]}
                        size={30}
                        radius="50%"
                      />
                      <div>
                        <p className="text-xs font-semibold text-text-primary">
                          {doc.replace("Dr. ", "")}
                        </p>
                        <p className="text-[10px] text-text-tertiary">
                          {docApps.length} today
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <div className="w-[60px] h-1 rounded-full bg-border-primary overflow-hidden">
                        <div
                          className="h-full bg-accent-blue rounded-full"
                          style={{
                            width: `${docApps.length > 0 ? (confirmed / docApps.length) * 100 : 0}%`,
                            transition: "width 600ms ease",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-tertiary">
                        {confirmed}/{docApps.length}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Action Required */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-20 p-5"
          >
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">
              Action Required
            </h3>
            <div className="flex flex-col gap-2">
              {todayAll
                .filter((a) => !a.intakeComplete || !a.insuranceVerified)
                .map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className="p-3 rounded-[12px] bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        initials={app.patientAvatar}
                        size={24}
                        radius="50%"
                      />
                      <p className="text-xs font-semibold text-text-primary">
                        {app.patientName}
                      </p>
                      <span className="text-[10px] text-text-tertiary ml-auto">
                        {app.time}
                      </span>
                    </div>
                    <div className="flex gap-[6px] flex-wrap">
                      {!app.intakeComplete && (
                        <button
                          onClick={() => {
                            dispatch(
                              updateAppointmentChecks({
                                id: app.id,
                                intakeComplete: true,
                              }),
                            );
                            dispatch(
                              addToast({
                                message: `Intake completed for ${app.patientName}.`,
                                type: "success",
                              }),
                            );
                          }}
                          className="flex items-center gap-1 text-[10px] font-semibold py-[3px] px-2 rounded-[6px] bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] cursor-pointer font-sans"
                        >
                          <ClipboardCheck size={10} /> Complete Intake
                        </button>
                      )}
                      {!app.insuranceVerified && (
                        <button
                          onClick={() => {
                            dispatch(
                              updateAppointmentChecks({
                                id: app.id,
                                insuranceVerified: true,
                              }),
                            );
                            dispatch(
                              addToast({
                                message: `Insurance verified for ${app.patientName}.`,
                                type: "success",
                              }),
                            );
                          }}
                          className="flex items-center gap-1 text-[10px] font-semibold py-[3px] px-2 rounded-[6px] bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] cursor-pointer font-sans"
                        >
                          <ShieldCheck size={10} /> Verify Insurance
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              {todayAll.filter((a) => !a.intakeComplete || !a.insuranceVerified)
                .length === 0 && (
                <p className="text-[13px] text-text-tertiary text-center py-4">
                  All clear for today
                </p>
              )}
            </div>
          </motion.div>

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-20 p-5"
          >
            <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock size={15} className="text-accent-cyan" /> Time Slots
            </h3>
            {todayAll.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-3">
                No appointments today
              </p>
            ) : (
              todayAll.map((app, i) => (
                <div
                  key={app.id}
                  className={cn(
                    "flex items-center gap-[10px] py-[7px]",
                    i < todayAll.length - 1 && "border-b border-border-primary",
                  )}
                >
                  <span className="text-[11px] text-text-tertiary w-10 shrink-0">
                    {app.time}
                  </span>
                  <div
                    className="flex-1 py-1 px-[10px] rounded-[8px] text-[11px] font-medium overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      background: STATUS_CONFIG[app.status].bg,
                      color: STATUS_CONFIG[app.status].color,
                    }}
                  >
                    {app.patientName}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNewAppModal && (
          <NewAppointmentModal
            defaultDate={formatDateKey(selectedDate)}
            onClose={() => setShowNewAppModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px]"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-[520px] rounded-[24px] bg-bg-secondary border border-border-primary overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 bg-bg-tertiary border-b border-border-primary">
                <div className="flex items-center gap-[14px]">
                  <Avatar
                    initials={selectedApp.patientAvatar}
                    size={48}
                    radius="16px"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[18px] font-bold text-text-primary">
                      {selectedApp.patientName}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-text-secondary">
                        DOB: {selectedApp.dob}
                      </span>
                      <span className="text-xs text-text-tertiary">·</span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Phone size={11} /> {selectedApp.phone}
                      </span>
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1 text-xs font-medium py-1 px-[10px] rounded-[10px] shrink-0"
                    style={{
                      background: STATUS_CONFIG[selectedApp.status].bg,
                      color: STATUS_CONFIG[selectedApp.status].color,
                    }}
                  >
                    {STATUS_CONFIG[selectedApp.status].icon}{" "}
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-[10px]">
                  {[
                    {
                      label: "Date",
                      value: new Date(selectedApp.date).toLocaleDateString(
                        "en-IN",
                        { weekday: "long", day: "numeric", month: "long" },
                      ),
                    },
                    {
                      label: "Time",
                      value: `${selectedApp.time} (${selectedApp.duration} min)`,
                    },
                    { label: "Doctor", value: selectedApp.doctor },
                    { label: "Visit Type", value: selectedApp.type },
                    { label: "Clinic", value: selectedApp.clinicName },
                    {
                      label: "Insurance Provider",
                      value: selectedApp.insuranceProvider,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="p-3 rounded-[12px] bg-bg-tertiary"
                    >
                      <p className="text-[11px] text-text-tertiary mb-1">
                        {label}
                      </p>
                      <p className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex-1 p-[14px] rounded-[14px] text-center",
                      selectedApp.intakeComplete
                        ? "bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.2)]"
                        : "bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]",
                    )}
                  >
                    <p className="text-[20px] mb-1">
                      {selectedApp.intakeComplete ? "✅" : "⏳"}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        selectedApp.intakeComplete
                          ? "text-[#0ea5e9]"
                          : "text-[#f59e0b]",
                      )}
                    >
                      Patient Intake
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-[2px]">
                      {selectedApp.intakeComplete ? "Complete" : "Pending"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex-1 p-[14px] rounded-[14px] text-center",
                      selectedApp.insuranceVerified
                        ? "bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.2)]"
                        : "bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]",
                    )}
                  >
                    <p className="text-[20px] mb-1">
                      {selectedApp.insuranceVerified ? "✅" : "❌"}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        selectedApp.insuranceVerified
                          ? "text-[#0ea5e9]"
                          : "text-[#ef4444]",
                      )}
                    >
                      Insurance
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-[2px]">
                      {selectedApp.insuranceVerified
                        ? "Verified"
                        : "Not Verified"}
                    </p>
                  </div>
                </div>

                {selectedApp.notes && (
                  <div className="p-[14px] rounded-[14px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]">
                    <p className="text-xs font-semibold text-[#f59e0b] mb-[6px]">
                      ⚠️ Doctor Notes
                    </p>
                    <p className="text-[13px] text-text-secondary leading-[1.6]">
                      {selectedApp.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-[10px]">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 py-3 rounded-[12px] border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans text-sm font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleViewPatient}
                    className="flex-1 py-3 rounded-[12px] border-0 text-white cursor-pointer font-sans text-sm font-semibold"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    View Patient
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentsPage;
