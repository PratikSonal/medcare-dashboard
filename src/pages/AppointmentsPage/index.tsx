import { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { Appointment } from "@/features/appointments/types";
import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { KpiCard } from "@/components/ui/KpiCard";
import NewAppointmentModal from "@/components/modal/NewAppointmentModal";
import { getWeekDays, formatDateKey } from "./helpers";
import { TODAY_DATE } from "./constants";
import { WeekStrip } from "./components/WeekStrip";
import { FilterBar } from "./components/FilterBar";
import { AppointmentList } from "./components/AppointmentList";
import { DoctorSchedules } from "./components/DoctorSchedules";
import { ActionRequired } from "./components/ActionRequired";
import { TimeSlots } from "./components/TimeSlots";
import { AppointmentDetailModal } from "./components/AppointmentDetailModal";

const AppointmentsPage = (): React.ReactElement => {
  const appointments = useAppSelector((s: RootState) => s.appointments.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date(TODAY_DATE));
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);

  const { baseDate, weekDays } = useMemo(() => {
    const d = new Date(TODAY_DATE);
    d.setDate(d.getDate() + weekOffset * 7);
    return { baseDate: d, weekDays: getWeekDays(d) };
  }, [weekOffset]);

  const dateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  const todayAll = useMemo(
    () =>
      appointments
        .filter((a: Appointment) => a.date === dateKey)
        .sort((a: Appointment, b: Appointment) => a.time.localeCompare(b.time)),
    [appointments, dateKey],
  );

  const todayApps = useMemo(
    () =>
      todayAll
        .filter(a => {
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
        .sort((a, b) => a.time.localeCompare(b.time)),
    [todayAll, filterStatus, filterType, searchQuery],
  );

  const hasActiveFilters = filterStatus !== "All" || filterType !== "All";

  const handleClearFilters = useCallback(() => {
    setFilterStatus("All");
    setFilterType("All");
  }, []);
  const handlePrevWeek = useCallback(() => setWeekOffset(w => w - 1), []);
  const handleNextWeek = useCallback(() => setWeekOffset(w => w + 1), []);
  const handleToggleFilters = useCallback(() => setShowFilters(f => !f), []);
  const handleOpenNewAppModal = useCallback(() => setShowNewAppModal(true), []);
  const handleCloseNewAppModal = useCallback(() => setShowNewAppModal(false), []);
  const handleCloseDetailModal = useCallback(() => setSelectedApp(null), []);

  const doctors = useMemo(
    () => [...new Set(appointments.map((a: Appointment) => a.doctor))],
    [appointments],
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Today",
        value: todayAll.length,
        color: "var(--accent-blue)",
        icon: <Calendar size={20} />,
        desc: "All scheduled visits",
        filter: "All",
      },
      {
        label: "Confirmed",
        value: todayAll.filter(a => a.status === "Confirmed").length,
        color: "var(--accent-cyan)",
        icon: <CheckCircle size={20} />,
        desc: "Ready to proceed",
        filter: "Confirmed",
      },
      {
        label: "Pending",
        value: todayAll.filter(a => a.status === "Pending").length,
        color: "var(--accent-yellow)",
        icon: <AlertCircle size={20} />,
        desc: "Awaiting confirmation",
        filter: "Pending",
      },
      {
        label: "No-Shows",
        value: todayAll.filter(a => a.status === "No-Show").length,
        color: "var(--accent-red)",
        icon: <XCircle size={20} />,
        desc: "Did not attend",
        filter: "No-Show",
      },
    ],
    [todayAll],
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-text-primary">Appointments</h1>
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
            type="button"
            onClick={handleOpenNewAppModal}
            whileHover="hover"
            initial="rest"
            className="flex items-center gap-2 py-[10px] px-5 rounded-[12px] border-0 text-white font-semibold cursor-pointer font-sans text-sm [background:var(--gradient-primary)]"
          >
            <motion.span
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.2, transition: { duration: 0.2, ease: "easeOut" } },
              }}
              className="inline-flex"
            >
              <Plus size={16} />
            </motion.span>
            New Appointment
          </motion.button>
        </div>
        <div className="glow-line mt-5" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <KpiCard
              size="sm"
              title={stat.label}
              rawValue={stat.value}
              sub={stat.desc}
              icon={stat.icon}
              color={stat.color}
              active={filterStatus === stat.filter}
              onClick={() => setFilterStatus(stat.filter)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_320px] gap-6">
        <div>
          <WeekStrip
            weekDays={weekDays}
            baseDate={baseDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatus={setFilterStatus}
            filterType={filterType}
            onFilterType={setFilterType}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
          <AppointmentList
            todayApps={todayApps}
            dateKey={dateKey}
            filterStatus={filterStatus}
            onSelectApp={setSelectedApp}
          />
        </div>

        <div className="flex flex-col gap-4">
          <DoctorSchedules doctors={doctors} todayAll={todayAll} />
          <ActionRequired todayAll={todayAll} />
          <TimeSlots todayAll={todayAll} />
        </div>
      </div>

      <AnimatePresence>
        {showNewAppModal && (
          <NewAppointmentModal
            defaultDate={formatDateKey(selectedDate)}
            onClose={handleCloseNewAppModal}
          />
        )}
      </AnimatePresence>

      <AppointmentDetailModal app={selectedApp} onClose={handleCloseDetailModal} />
    </div>
  );
};

export default AppointmentsPage;
