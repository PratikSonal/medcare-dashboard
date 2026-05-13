import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, X } from "lucide-react";
import { APPT_TYPE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { ALL_STATUSES } from "../constants";
import type { FilterBarProps } from "./types";

export const FilterBar = ({
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
}: FilterBarProps) => (
  <div className="mb-4">
    <div className="flex gap-[10px] items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by patient, doctor, type, clinic, insurance…"
      />
      <button
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
          style={{
            transition: "transform 200ms",
            transform: showFilters ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {hasActiveFilters && (
        <button
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
                {["All", ...ALL_STATUSES].map(s => (
                  <button
                    key={s}
                    onClick={() => onFilterStatus(s)}
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
                {["All", ...Object.keys(APPT_TYPE_COLORS)].map(t => (
                  <button
                    key={t}
                    onClick={() => onFilterType(t)}
                    className="py-[5px] px-3 rounded-[10px] text-xs font-medium cursor-pointer font-sans transition-all duration-150 border-0"
                    style={{
                      background:
                        filterType === t
                          ? (APPT_TYPE_COLORS[t] ?? "var(--accent-blue)")
                          : "var(--bg-tertiary)",
                      color: filterType === t ? "white" : "var(--text-secondary)",
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
);
