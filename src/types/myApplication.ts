
export interface MyApplication {
  id: string;
  type: 'leave' | 'missed_checkin' | 'overtime';
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  details: any;
}
