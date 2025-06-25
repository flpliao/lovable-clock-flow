
export interface MyApplication {
  id: string;
  type: 'leave' | 'missed_checkin' | 'overtime';
  title: string;
  applicant: string;
  department?: string;
  date?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  created_at: string;
  details: any;
}
