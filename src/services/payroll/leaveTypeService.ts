
import { supabase } from '@/integrations/supabase/client';

export class LeaveTypeService {
  // 請假類型相關操作
  static async getLeaveTypes() {
    console.log('🔍 獲取請假類型...');
    
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 獲取請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型獲取成功:', data?.length);
    return data;
  }

  static async createLeaveType(leaveTypeData: any) {
    console.log('📝 創建請假類型:', leaveTypeData);

    const insertData = {
      code: leaveTypeData.code,
      name_zh: leaveTypeData.name_zh,
      name_en: leaveTypeData.name_en,
      is_paid: leaveTypeData.is_paid || false,
      annual_reset: leaveTypeData.annual_reset !== undefined ? leaveTypeData.annual_reset : true,
      max_days_per_year: leaveTypeData.max_days_per_year,
      requires_attachment: leaveTypeData.requires_attachment || false,
      description: leaveTypeData.description,
      is_active: leaveTypeData.is_active !== undefined ? leaveTypeData.is_active : true,
      sort_order: leaveTypeData.sort_order || 0
    };

    const { data, error } = await supabase
      .from('leave_types')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型創建成功');
    return data;
  }

  static async updateLeaveType(id: string, updates: any) {
    console.log('📝 更新請假類型:', id, updates);

    const { data, error } = await supabase
      .from('leave_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ 更新請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型更新成功');
    return data;
  }
}
