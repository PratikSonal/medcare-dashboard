import type { Patient } from '@/types';

export type TabId = 'overview' | 'appointments' | 'billing' | 'prescriptions';

export interface Props {
  patient: Patient;
  onClose: () => void;
}
