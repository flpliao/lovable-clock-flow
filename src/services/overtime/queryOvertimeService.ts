
import { supabase } from '@/integrations/supabase/client';

export const queryOvertimeService = {
  async getOvertimeRequestsByStaff(staffId: string) {
    console.log('🔍 查詢員工加班記錄:', staffId);
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at
        )
      `)
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢加班記錄失敗:', error);
      throw error;
    }

    console.log('✅ 查詢加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  // 新增：所有用戶都可以查看自己的加班記錄（不受權限限制）
  async getOvertimeRequestsByCurrentUser(currentUserId: string) {
    console.log('🔍 查詢當前用戶加班記錄（不受權限限制）:', currentUserId);
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at
        )
      `)
      .eq('staff_id', currentUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢當前用戶加班記錄失敗:', error);
      // 即使出錯也返回空陣列，避免影響頁面渲染
      return [];
    }

    console.log('✅ 查詢當前用戶加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  async getPendingOvertimeRequests() {
    console.log('🔍 查詢待審核加班申請');
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position,
          supervisor_id
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢待審核加班申請失敗:', error);
      throw error;
    }

    console.log('✅ 查詢待審核加班申請成功:', data?.length, '筆記錄');
    return data || [];
  }
};
