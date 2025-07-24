import type { CheckInMethod, CheckInType } from '@/constants/checkInTypes';

// 打卡記錄
export interface CheckInRecord {
  id?: string;
  employee_id?: string;
  type: CheckInType;
  method: CheckInMethod;
  status?: 'success' | 'failed';
  distance?: number;
  latitude: number;
  longitude: number;
  ip_address: string;
  created_at?: string;
}

// 打卡點
export interface CheckInPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  check_in_radius: number;
  created_at: string;
  disabled_at: string | null;
  distance?: number;
}
