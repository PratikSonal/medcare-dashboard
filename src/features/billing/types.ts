export type ClaimStatus = "Approved" | "Pending" | "Denied" | "Partial";

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  visitDate: string;
  department: string;
  procedure: string;
  doctor: string;
  totalAmount: number;
  insuranceProvider: string;
  policyNumber: string;
  claimStatus: ClaimStatus;
  insuranceCovered: number;
  patientDue: number;
}
