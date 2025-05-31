
import { supabase } from '@/integrations/supabase/client';

export interface Schedule {
  id: string;
  user_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchedule {
  user_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  created_by: string;
}

export const scheduleService = {
  // 建立多個排班記錄
  async createSchedules(schedules: CreateSchedule[]): Promise<Schedule[]> {
    console.log('Creating schedules:', schedules);
    
    const { data, error } = await supabase
      .from('schedules')
      .insert(schedules)
      .select('*');

    if (error) {
      console.error('Error creating schedules:', error);
      throw new Error(`建立排班失敗: ${error.message}`);
    }

    console.log('Successfully created schedules:', data);
    return data as Schedule[];
  },

  // 取得指定日期的排班記錄
  async getSchedulesForDate(date: string): Promise<Schedule[]> {
    console.log('Fetching schedules for date:', date);
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('work_date', date)
      .order('start_time');

    if (error) {
      console.error('Error fetching schedules:', error);
      throw new Error(`取得排班記錄失敗: ${error.message}`);
    }

    console.log('Fetched schedules:', data);
    return data as Schedule[];
  },

  // 取得所有排班記錄
  async getAllSchedules(): Promise<Schedule[]> {
    console.log('Fetching all schedules');
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('work_date', { ascending: true });

    if (error) {
      console.error('Error fetching all schedules:', error);
      throw new Error(`取得排班記錄失敗: ${error.message}`);
    }

    console.log('Fetched all schedules:', data);
    return data as Schedule[];
  },

  // 更新排班記錄
  async updateSchedule(id: string, updates: Partial<CreateSchedule>): Promise<Schedule> {
    console.log('Updating schedule:', id, updates);
    
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating schedule:', error);
      throw new Error(`更新排班失敗: ${error.message}`);
    }

    console.log('Successfully updated schedule:', data);
    return data as Schedule;
  },

  // 刪除排班記錄
  async deleteSchedule(id: string): Promise<void> {
    console.log('Deleting schedule:', id);
    
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting schedule:', error);
      throw new Error(`刪除排班失敗: ${error.message}`);
    }

    console.log('Successfully deleted schedule:', id);
  },

  // 取得用戶的排班記錄
  async getSchedulesForUser(userId: string): Promise<Schedule[]> {
    console.log('Fetching schedules for user:', userId);
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('work_date', { ascending: true });

    if (error) {
      console.error('Error fetching user schedules:', error);
      throw new Error(`取得用戶排班記錄失敗: ${error.message}`);
    }

    console.log('Fetched user schedules:', data);
    return data as Schedule[];
  },

  // 取得日期範圍內的排班記錄
  async getSchedulesForDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    console.log('Fetching schedules for date range:', startDate, 'to', endDate);
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .gte('work_date', startDate)
      .lte('work_date', endDate)
      .order('work_date', { ascending: true });

    if (error) {
      console.error('Error fetching schedules for date range:', error);
      throw new Error(`取得日期範圍排班記錄失敗: ${error.message}`);
    }

    console.log('Fetched schedules for date range:', data);
    return data as Schedule[];
  }
};
