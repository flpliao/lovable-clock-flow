
import { supabase } from '@/integrations/supabase/client';

export class LeaveTypeService {
  // 請假類型相關操作
  static async getLeaveTypes() {
    console.log('🔍 獲取請假類型...');
    
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 獲取請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型獲取成功:', data?.length);
    return data;
  }

  static async getActiveLeaveTypes() {
    console.log('🔍 獲取啟用的請假類型...');
    
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 獲取啟用請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 啟用請假類型獲取成功:', data?.length);
    return data;
  }

  static async createLeaveType(leaveTypeData: any) {
    console.log('📝 創建請假類型:', leaveTypeData);

    // 檢查代碼是否重複
    const { data: existing } = await supabase
      .from('leave_types')
      .select('id')
      .eq('code', leaveTypeData.code)
      .maybeSingle();

    if (existing) {
      throw new Error('假別代碼已存在，請使用其他代碼');
    }

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
      sort_order: leaveTypeData.sort_order || 0,
      is_system_default: false // 新增的假別都不是系統預設
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

    // 如果更新代碼，檢查是否重複
    if (updates.code) {
      const { data: existing } = await supabase
        .from('leave_types')
        .select('id')
        .eq('code', updates.code)
        .neq('id', id)
        .maybeSingle();

      if (existing) {
        throw new Error('假別代碼已存在，請使用其他代碼');
      }
    }

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
    const { data: leaveType } = await supabase
      .from('leave_types')
      .select('is_system_default, code')
      .eq('id', id)
      .single();

    if (leaveType?.is_system_default) {
      throw new Error('系統預設假別無法刪除');
    }

    // 檢查是否有相關的請假申請
    const { data: requests } = await supabase
      .from('leave_requests')
      .select('id')
      .eq('leave_type', leaveType?.code)
      .limit(1);

    if (requests && requests.length > 0) {
      throw new Error('該假別已有相關請假申請，無法刪除。請考慮停用該假別。');
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

  static async getLeaveTypeByCode(code: string) {
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('獲取假別失敗:', error);
      return null;
    }

    return data;
  }
}
