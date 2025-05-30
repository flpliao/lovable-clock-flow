
import { supabase } from '@/integrations/supabase/client';
import { Staff, NewStaff } from '../types';

export class StaffApiService {
  static async addStaff(staffData: NewStaff): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .insert(staffData)
      .select()
      .single();

    if (error) {
      // 暫時忽略權限錯誤，提供友善訊息
      if (error.message.includes('PGRST301') || error.message.includes('policy') || error.message.includes('RLS')) {
        throw new Error('目前系統正在設定權限，請稍後再試或聯繫管理員');
      }
      throw error;
    }

    return data;
  }

  static async updateStaff(id: string, updateData: Partial<Staff>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase 更新錯誤:', error);
      if (error.message.includes('PGRST301') || error.message.includes('policy') || error.message.includes('RLS')) {
        throw new Error('目前系統正在設定權限，請稍後再試或聯繫管理員');
      }
      throw error;
    }

    return data;
  }

  static async deleteStaff(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.message.includes('PGRST301') || error.message.includes('policy') || error.message.includes('RLS')) {
        throw new Error('目前系統正在設定權限，請稍後再試或聯繫管理員');
      }
      throw error;
    }
  }
}
