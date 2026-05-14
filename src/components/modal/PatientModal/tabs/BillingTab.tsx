import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { memo } from "react";

import { CLAIM_STATUS_COLORS } from "@/features/billing/constants";
import type { BillingRecord } from "@/features/billing/types";
import { cn } from "@/utils";

interface Props {
  billingRecords: BillingRecord[];
}

export const BillingTab = memo(({ billingRecords }: Props): React.ReactElement => {
  const billing = billingRecords[0];

  return (
    <motion.div
      key="billing"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-5"
    >
      {billing ? (
        <>
          <div className="p-4 rounded-[16px] bg-[rgba(60,131,246,0.06)] border border-[var(--accent-blue-border)]">
            <div className="flex items-center gap-2 mb-[14px]">
              <Shield size={15} className="text-accent-blue" />
              <h3 className="text-sm font-semibold text-text-primary">Insurance Details</h3>
              <span
                className={cn(
                  "ml-auto text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px]",
                  billing.insuranceCovered > 0
                    ? "bg-[var(--accent-cyan-subtle)] text-accent-cyan"
                    : "bg-[var(--accent-red-subtle)] text-accent-red",
                )}
              >
                {billing.insuranceCovered > 0 ? "Covered" : "Unverified"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              {[
                { label: "Provider", value: billing.insuranceProvider },
                { label: "Policy Number", value: billing.policyNumber },
              ].map(({ label, value }) => (
                <div key={label} className="py-[10px] px-3 rounded-[10px] bg-bg-card">
                  <p className="text-[11px] text-text-tertiary mb-[3px]">{label}</p>
                  <p className="text-[13px] font-semibold text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Billing History</h3>
            <div className="flex flex-col gap-2">
              {billingRecords.map(record => (
                <div
                  key={record.id}
                  className="p-[14px] rounded-[14px] bg-bg-tertiary border border-border-primary"
                >
                  <div className="flex items-start justify-between gap-3 mb-[10px]">
                    <div>
                      <p className="text-[13px] font-semibold text-text-primary">
                        {record.procedure}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-[2px]">
                        {record.department} ·{" "}
                        {format(parseISO(record.visitDate), "d MMM yyyy")}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-semibold py-[3px] px-[10px] rounded-[8px] shrink-0"
                      style={{
                        background: CLAIM_STATUS_COLORS[record.claimStatus].bg,
                        color: CLAIM_STATUS_COLORS[record.claimStatus].color,
                      }}
                    >
                      {record.claimStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Total", value: `₹${record.totalAmount.toLocaleString("en-IN")}` },
                      { label: "Insurance", value: `₹${record.insuranceCovered.toLocaleString("en-IN")}` },
                      { label: "Patient Due", value: `₹${record.patientDue.toLocaleString("en-IN")}` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-text-tertiary mb-[2px]">{label}</p>
                        <p className="text-[13px] font-bold text-text-primary">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-text-tertiary">
          <Shield size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No billing records found</p>
        </div>
      )}
    </motion.div>
  );
});
