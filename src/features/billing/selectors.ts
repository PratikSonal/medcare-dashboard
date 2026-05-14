import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

const selectRecords = (s: RootState) => s.billing.records;

export const selectTotalBilled = createSelector(
  selectRecords,
  records => records.reduce((sum, r) => sum + r.totalAmount, 0),
);

export const selectTotalInsuranceCovered = createSelector(
  selectRecords,
  records => records.reduce((sum, r) => sum + r.insuranceCovered, 0),
);

export const selectTotalPatientDue = createSelector(
  selectRecords,
  records => records.reduce((sum, r) => sum + r.patientDue, 0),
);

export const selectApprovalRate = createSelector(selectRecords, records => {
  if (records.length === 0) return 0;
  const approved = records.filter(r => r.claimStatus === "Approved").length;
  return Math.round((approved / records.length) * 100);
});

export const selectBillingByStatus = createSelector(selectRecords, records => ({
  Approved: records.filter(r => r.claimStatus === "Approved").length,
  Partial: records.filter(r => r.claimStatus === "Partial").length,
  Pending: records.filter(r => r.claimStatus === "Pending").length,
  Denied: records.filter(r => r.claimStatus === "Denied").length,
}));
