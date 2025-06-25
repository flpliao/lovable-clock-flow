
// 統一的 MyApplication 介面定義，包含 cancelled 狀態
export interface MyApplication {
  id: string;
  type: 'overtime' | 'missed_checkin' | 'leave';
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  details: any;
}
