
import { supabase } from '@/integrations/supabase/client';

export const queryOvertimeService = {
  async getOvertimeRequestsByCurrentUser(currentUserId: string) {
    console.log('🔍 查詢當前用戶加班記錄（僅限自己）:', currentUserId);
    
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
          created_at,
          updated_at
        )
      `)
      .eq('staff_id', currentUserId)  // 僅查詢自己的記錄
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢當前用戶加班記錄失敗:', error);
      return [];
    }

    console.log('✅ 查詢當前用戶加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  async getOvertimeRequestsByStaff(staffId: string, requesterId: string) {
    // 確保只能查詢自己的記錄或有權限的記錄
    if (staffId !== requesterId) {
      // 檢查是否為管理員或主管
      const { data: requesterData } = await supabase
        .from('staff')
        .select('role')
        .eq('id', requesterId)
        .single();
        
      if (!requesterData || requesterData.role !== 'admin') {
        throw new Error('無權限查詢此員工的加班記錄');
      }
    }
    
    console.log('🔍 查詢員工加班記錄:', staffId);
    
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
          created_at,
          updated_at
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
          created_at,
          updated_at
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
