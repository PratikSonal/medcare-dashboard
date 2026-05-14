import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { mockBillingData } from "@/data/billing";

import type { BillingRecord, ClaimStatus } from "./types";

interface BillingState {
  records: BillingRecord[];
}

const initialState: BillingState = {
  records: mockBillingData,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    updateClaimStatus(state, action: PayloadAction<{ id: string; status: ClaimStatus }>) {
      const record = state.records.find(r => r.id === action.payload.id);
      if (record) record.claimStatus = action.payload.status;
    },
  },
});

export const { updateClaimStatus } = billingSlice.actions;
export default billingSlice.reducer;
