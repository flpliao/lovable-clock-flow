
import { supabase } from '@/integrations/supabase/client';

export interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  requires_checkin: boolean;
  is_active: boolean;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTimeSlot {
  name: string;
  start_time: string;
  end_time: string;
  requires_checkin: boolean;
  sort_order: number;
  created_by: string;
}

export const timeSlotService = {
  // 取得所有活躍的時間段
  async getActiveTimeSlots(): Promise<TimeSlot[]> {
    console.log('Fetching active time slots');
    
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching time slots:', error);
      throw new Error(`取得時間段失敗: ${error.message}`);
    }

    console.log('Fetched time slots:', data);
    return data as TimeSlot[];
  },

  // 取得所有時間段（含停用的）
  async getAllTimeSlots(): Promise<TimeSlot[]> {
    console.log('Fetching all time slots');
    
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Error fetching all time slots:', error);
      throw new Error(`取得時間段失敗: ${error.message}`);
    }

    console.log('Fetched all time slots:', data);
    return data as TimeSlot[];
  },

  // 新增時間段
  async createTimeSlot(timeSlot: CreateTimeSlot): Promise<TimeSlot> {
    console.log('Creating time slot:', timeSlot);
    
    const { data, error } = await supabase
      .from('time_slots')
      .insert(timeSlot)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating time slot:', error);
      throw new Error(`建立時間段失敗: ${error.message}`);
    }

    console.log('Successfully created time slot:', data);
    return data as TimeSlot;
  },

  // 更新時間段
  async updateTimeSlot(id: string, updates: Partial<CreateTimeSlot>): Promise<TimeSlot> {
    console.log('Updating time slot:', id, updates);
    
    const { data, error } = await supabase
      .from('time_slots')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating time slot:', error);
      throw new Error(`更新時間段失敗: ${error.message}`);
    }

    console.log('Successfully updated time slot:', data);
    return data as TimeSlot;
  },

  // 刪除時間段（軟刪除）
  async deleteTimeSlot(id: string): Promise<void> {
    console.log('Deleting time slot:', id);
    
    const { error } = await supabase
      .from('time_slots')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting time slot:', error);
      throw new Error(`刪除時間段失敗: ${error.message}`);
    }

    console.log('Successfully deleted time slot:', id);
  }
};
