import { ApprovalStatus } from '@/constants/approvalStatus';
import type {
  CheckInMethod,
  CheckInSource,
  CheckInStatus,
  RequestType,
} from '@/constants/checkInTypes';

// 打卡記錄
export interface CheckInRecord {
  id?: string;
  employee_id?: string;
  type: RequestType;
  method: CheckInMethod;
  status?: CheckInStatus;
  distance?: number;
  latitude: number;
  longitude: number;
  ip_address: string;
  source: CheckInSource;
  approval_status?: ApprovalStatus;
  is_late?: boolean;
  is_early_leave?: boolean;
  checked_at: string;
  location_name?: string;
}

// 打卡點
export interface CheckInPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  check_in_radius: number;
  created_at: string;
  disabled_at: string | null;
  distance?: number;
}
