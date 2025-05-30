
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
      console.error('❌ Supabase 新增錯誤:', error);
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
      console.error('❌ Supabase 更新錯誤:', error);
      throw error;
    }

    return data;
  }

  static async deleteStaff(id: string): Promise<void> {
    console.log('🗑️ StaffApiService: 刪除員工，ID:', id);
    
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ StaffApiService: 刪除失敗:', error);
      throw error;
    }

    console.log('✅ StaffApiService: 員工刪除成功');
  }
}
