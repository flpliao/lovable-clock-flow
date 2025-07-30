// 請假類型介面定義
export interface LeaveType {
  slug: string;
  name: string;
  code: string;
  paid: boolean;
  max_per_year?: number;
  annual_reset?: boolean;
  required_attachment?: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}
