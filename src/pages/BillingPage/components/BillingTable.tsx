import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import type { ClaimStatus } from "@/features/billing/types";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/utils";
import { CLAIM_STATUS_COLORS, PROVIDER_SHORT } from "@/features/billing/constants";
import { item, ALL_STATUSES, PAGE_SIZE } from "../constants";
import { BillingDetailModal } from "./BillingDetailModal";

export const BillingTable = (): React.ReactElement => {
  const records = useAppSelector(s => s.billing.records);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus[]>([]);
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const selectedRecord = selectedRecordId
    ? (records.find(r => r.id === selectedRecordId) ?? null)
    : null;

  const allProviders = useMemo(
    () => [...new Set(records.map(r => r.insuranceProvider))],
    [records],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(r => {
      const matchSearch =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.procedure.toLowerCase().includes(q) ||
        r.insuranceProvider.toLowerCase().includes(q);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(r.claimStatus);
      const matchProvider =
        providerFilter.length === 0 || providerFilter.includes(r.insuranceProvider);
      return matchSearch && matchStatus && matchProvider;
    });
  }, [records, search, statusFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRecords = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeFilters = statusFilter.length + providerFilter.length;

  const toggleStatus = (status: ClaimStatus) => {
    setStatusFilter(prev => (prev.includes(status) ? prev.filter(x => x !== status) : [...prev, status]));
    setPage(1);
  };
  const toggleProvider = (provider: string) => {
    setProviderFilter(prev => (prev.includes(provider) ? prev.filter(x => x !== provider) : [...prev, provider]));
    setPage(1);
  };

  return (
    <>
      <motion.div variants={item} className="glass-card rounded-20 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Billing Records</h2>
            <p className="text-[13px] text-text-secondary mt-[2px]">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {activeFilters > 0 ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={v => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search patient, doctor, procedure..."
              width={260}
            />
            <button
              type="button"
              onClick={() => setFilterOpen(o => !o)}
              className={cn(
                "flex items-center gap-[6px] px-[14px] py-2 rounded-[10px] text-[13px] font-medium cursor-pointer font-sans transition-all duration-150 border",
                activeFilters > 0
                  ? "border-accent-blue bg-[rgba(60,131,246,0.08)] text-accent-blue"
                  : "border-border-primary bg-bg-secondary text-text-secondary",
              )}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters > 0 && (
                <span className="bg-accent-blue text-white rounded-full text-[10px] font-bold px-[6px] py-[1px]">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ maxHeight: filterOpen ? 200 : 0, opacity: filterOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="p-4 rounded-12 bg-bg-secondary border border-border-primary mb-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] w-[70px] shrink-0">
                Status
              </span>
              {ALL_STATUSES.map(status => {
                const active = statusFilter.includes(status);
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatus(status)}
                    className="px-3 py-1 rounded-full text-xs cursor-pointer font-sans transition-all duration-150"
                    style={{
                      border: `1px solid ${active ? CLAIM_STATUS_COLORS[status].color : "var(--border-primary)"}`,
                      background: active ? CLAIM_STATUS_COLORS[status].bg : "transparent",
                      color: active ? CLAIM_STATUS_COLORS[status].color : "var(--text-secondary)",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] w-[70px] shrink-0 pt-[5px]">
                Provider
              </span>
              <div className="flex flex-wrap gap-[6px]">
                {allProviders.map(provider => {
                  const active = providerFilter.includes(provider);
                  return (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => toggleProvider(provider)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs cursor-pointer font-sans transition-all duration-150 border",
                        active
                          ? "border-accent-blue bg-[rgba(60,131,246,0.1)] text-accent-blue font-semibold"
                          : "border-border-primary bg-transparent text-text-secondary",
                      )}
                    >
                      {PROVIDER_SHORT[provider] || provider}
                    </button>
                  );
                })}
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter([]);
                  setProviderFilter([]);
                  setPage(1);
                }}
                className="mt-3 text-xs text-accent-red bg-transparent border-0 cursor-pointer font-sans p-0"
              >
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-border-primary">
                {[
                  "Patient",
                  "Date",
                  "Procedure",
                  "Doctor",
                  "Insurance Provider",
                  "Total",
                  "Status",
                  "Patient Due",
                ].map(h => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-tertiary text-sm">
                    No records match your search or filters.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((record, i) => (
                  <motion.tr
                    key={record.id}
                    onClick={() => setSelectedRecordId(record.id)}
                    whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
                    className={cn(
                      "cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary",
                      i < pagedRecords.length - 1 && "border-b border-border-primary",
                    )}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={record.patientAvatar} size={28} radius="50%" />
                        <span className="font-medium text-text-primary whitespace-nowrap">
                          {record.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">
                      {new Date(record.visitDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-3 py-3 text-text-secondary max-w-[200px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {record.procedure}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-[2px]">{record.department}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{record.doctor}</td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">
                      {PROVIDER_SHORT[record.insuranceProvider] || record.insuranceProvider}
                    </td>
                    <td className="px-3 py-3 font-semibold text-text-primary whitespace-nowrap">
                      ₹{record.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="text-[11px] font-semibold px-[10px] py-1 rounded-[8px] whitespace-nowrap"
                        style={{
                          background: CLAIM_STATUS_COLORS[record.claimStatus].bg,
                          color: CLAIM_STATUS_COLORS[record.claimStatus].color,
                        }}
                      >
                        {record.claimStatus}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3 font-semibold whitespace-nowrap",
                        record.patientDue > 50000 ? "text-accent-red" : "text-text-primary",
                      )}
                    >
                      ₹{record.patientDue.toLocaleString("en-IN")}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
            <span className="text-[13px] text-text-secondary">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-border-primary bg-bg-secondary text-text-secondary cursor-pointer disabled:cursor-not-allowed disabled:text-text-tertiary"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "flex items-center justify-center min-w-[32px] h-8 rounded-[8px] text-[13px] cursor-pointer font-sans border",
                    pageNum === safePage
                      ? "border-accent-blue bg-[rgba(60,131,246,0.1)] text-accent-blue font-semibold"
                      : "border-border-primary bg-bg-secondary text-text-secondary",
                  )}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-border-primary bg-bg-secondary text-text-secondary cursor-pointer disabled:cursor-not-allowed disabled:text-text-tertiary"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <BillingDetailModal record={selectedRecord} onClose={() => setSelectedRecordId(null)} />
    </>
  );
};
