
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

  // 獲取所有請假類型（包含停用的）
  static async getAllLeaveTypes() {
    console.log('🔍 獲取所有請假類型...');
    
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 獲取請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 所有請假類型獲取成功:', data?.length);
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
      max_days_per_month: leaveTypeData.max_days_per_month,
      requires_attachment: leaveTypeData.requires_attachment || false,
      requires_approval: leaveTypeData.requires_approval !== undefined ? leaveTypeData.requires_approval : true,
      gender_restriction: leaveTypeData.gender_restriction,
      description: leaveTypeData.description,
      is_active: leaveTypeData.is_active !== undefined ? leaveTypeData.is_active : true,
      is_system_default: false, // 用戶創建的假別不是系統預設
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

  static async deleteLeaveType(id: string) {
    console.log('🗑️ 刪除請假類型:', id);

    // 檢查是否為系統預設假別
    const { data: leaveType, error: fetchError } = await supabase
      .from('leave_types')
      .select('is_system_default')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ 查詢請假類型失敗:', fetchError);
      throw fetchError;
    }

    if (leaveType.is_system_default) {
      throw new Error('系統預設假別不可刪除，僅可停用');
    }

    const { error } = await supabase
      .from('leave_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ 刪除請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型刪除成功');
    return true;
  }
}
