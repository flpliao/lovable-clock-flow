export interface WorkSchedule {
  shift_id: string;
  slug: string;
  status: string;
  clock_in_time: string;
  clock_out_time: string;
  ot_start_after_hours: number;
  ot_start_after_minutes: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkScheduleData {
  shift_id: string;
  slug: string;
  status: string;
  clock_in_time: string;
  clock_out_time: string;
  ot_start_after_hours: number;
  ot_start_after_minutes: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
}

export interface UpdateWorkScheduleData {
  shift_id?: string;
  slug?: string;
  status?: string;
  clock_in_time?: string;
  clock_out_time?: string;
  ot_start_after_hours?: number;
  ot_start_after_minutes?: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
}
