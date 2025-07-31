export interface Shift {
  id: string;
  slug: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  work_hours: number;
  is_active: boolean;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateShiftData {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  work_hours: number;
  is_active: boolean;
  description?: string;
  color?: string;
}

export interface UpdateShiftData {
  name?: string;
  code?: string;
  start_time?: string;
  end_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  work_hours?: number;
  is_active?: boolean;
  description?: string;
  color?: string;
}
