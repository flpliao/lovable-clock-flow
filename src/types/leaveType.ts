// 薪資類型 enum
export enum PaidType {
  UNPAID = 'unpaid',
  HALF = 'half',
  PAID = 'paid',
}

// 請假類型介面定義
export interface LeaveType {
  slug: string;
  name: string;
  code: string;
  paid_type: PaidType;
  max_per_year?: number;
  annual_reset?: boolean;
  required_attachment?: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}
