
import { Schedule } from './types';
import { Schedule as SupabaseSchedule, CreateSchedule } from '@/services/scheduleService';

// 轉換函數：Supabase 格式 -> 應用程式格式
export const transformFromSupabase = (supabaseSchedule: SupabaseSchedule): Schedule => ({
  id: supabaseSchedule.id,
  userId: supabaseSchedule.user_id,
  workDate: supabaseSchedule.work_date,
  startTime: supabaseSchedule.start_time,
  endTime: supabaseSchedule.end_time,
  timeSlot: supabaseSchedule.time_slot,
  createdBy: supabaseSchedule.created_by,
});

// 轉換函數：應用程式格式 -> Supabase 格式
export const transformToSupabase = (schedule: Omit<Schedule, 'id'>, createdBy: string): CreateSchedule => ({
  user_id: schedule.userId,
  work_date: schedule.workDate,
  start_time: schedule.startTime,
  end_time: schedule.endTime,
  time_slot: schedule.timeSlot,
  created_by: createdBy,
});
