import type { BillingRecord } from "@/features/billing/types";

export interface BillingDetailModalProps {
  record: BillingRecord | null;
  onClose: () => void;
}
