import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  setSearchQuery,
  setFilterStatus,
  setFilterDepartment,
  clearFilters,
} from "@/features/patients/patientsSlice";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, STATUSES } from "../constants";

export const FilterBar = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, filterStatus, filterDepartment } = useAppSelector(s => s.patients);
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = filterStatus !== "All" || filterDepartment !== "All";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <SearchInput
          value={searchQuery}
          onChange={v => dispatch(setSearchQuery(v))}
          placeholder="Search by name, diagnosis, doctor..."
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 py-[10px] px-4 rounded-[12px] text-[13px] font-medium border cursor-pointer font-sans transition-all duration-200",
            hasActiveFilters
              ? "border-[rgba(60,131,246,0.4)] bg-[rgba(60,131,246,0.1)] text-accent-blue"
              : "border-border-primary bg-bg-secondary text-text-secondary",
          )}
        >
          <Filter size={15} /> Filters {hasActiveFilters && <Badge variant="info">Active</Badge>}
          <ChevronDown
            size={14}
            style={{
              transition: "transform 200ms",
              transform: showFilters ? "rotate(180deg)" : "none",
            }}
          />
        </button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-[6px]"
          >
            <X size={14} /> Clear
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            animate={{ opacity: 1, maxHeight: 240, marginBottom: 24 }}
            exit={{ opacity: 0, maxHeight: 0, marginBottom: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card rounded-[16px] p-5 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: "Status",
                  items: STATUSES,
                  current: filterStatus,
                  action: setFilterStatus,
                },
                {
                  label: "Department",
                  items: DEPARTMENTS,
                  current: filterDepartment,
                  action: setFilterDepartment,
                },
              ].map(({ label, items, current, action }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-3">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(s => (
                      <button
                        key={s}
                        onClick={() => dispatch(action(s))}
                        className={cn(
                          "py-[6px] px-3 rounded-[10px] text-xs font-medium border-0 cursor-pointer font-sans transition-all duration-200",
                          current === s
                            ? "bg-accent-blue text-white"
                            : "bg-bg-tertiary text-text-secondary",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
