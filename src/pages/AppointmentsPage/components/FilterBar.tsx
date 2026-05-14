import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, X } from "lucide-react";
import { APPT_TYPE_COLORS } from "@/features/appointments/constants";
import { cn } from "@/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { ALL_STATUSES } from "../constants";
import type { FilterBarProps } from "./types";

export const FilterBar = memo(({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatus,
  filterType,
  onFilterType,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  onClearFilters,
}: FilterBarProps): React.ReactElement => (
  <div className="mb-4">
    <div className="flex gap-[10px] items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by patient, doctor, type, clinic, insurance…"
      />
      <button
        type="button"
        onClick={onToggleFilters}
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
          className={cn("transition-transform duration-200", showFilters && "rotate-180")}
        />
      </button>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
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
                {["All", ...ALL_STATUSES].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onFilterStatus(status)}
                    className={cn(
                      "py-[5px] px-3 rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-150 border-0",
                      filterStatus === status
                        ? "bg-accent-blue text-white"
                        : "bg-bg-tertiary text-text-secondary",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] mb-[10px]">
                Appointment Type
              </p>
              <div className="flex flex-wrap gap-[6px]">
                {["All", ...Object.keys(APPT_TYPE_COLORS)].map(apptType => (
                  <button
                    key={apptType}
                    type="button"
                    onClick={() => onFilterType(apptType)}
                    className="py-[5px] px-3 rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-150 border-0"
                    style={{
                      background:
                        filterType === apptType
                          ? (APPT_TYPE_COLORS[apptType] ?? "var(--accent-blue)")
                          : "var(--bg-tertiary)",
                      color: filterType === apptType ? "white" : "var(--text-secondary)",
                    }}
                  >
                    {apptType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
