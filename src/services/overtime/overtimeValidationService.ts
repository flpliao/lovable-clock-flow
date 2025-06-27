
import { supabase } from '@/integrations/supabase/client';

export const overtimeValidationService = {
  // 獲取當前用戶 ID - 使用 Supabase Auth
  async getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('❌ 無法獲取當前用戶:', error);
      throw new Error('用戶未認證');
    }
    
    console.log('👤 當前認證用戶 ID:', user.id);
    return user.id;
  },

  // 計算加班時數
  calculateOvertimeHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // 處理跨午夜的情況
    let diffMinutes = endTotalMinutes - startTotalMinutes;
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // 加上24小時
    }
    
    return Math.round((diffMinutes / 60) * 100) / 100; // 保留兩位小數
  },

  // 檢查用戶權限
  async checkUserPermissions(userId: string, permission: string): Promise<boolean> {
    try {
      console.log('🔍 檢查用戶權限:', { userId, permission });
      
      // 獲取用戶角色資訊
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('role, role_id')
        .or(`user_id.eq.${userId},id.eq.${userId}`)
        .single();

      if (error || !staffData) {
        console.error('❌ 獲取用戶角色失敗:', error);
        return false;
      }

      // 根據角色判斷權限
      const role = staffData.role || staffData.role_id;
      
      // 管理員和 HR 擁有所有權限
      if (role === 'admin' || role === 'hr_manager') {
        return true;
      }

      // 部門主管擁有審核權限
      if (role === 'department_manager' && permission.includes('approve')) {
        return true;
      }

      // 一般用戶只能查看自己的記錄
      if (role === 'user' && permission.includes('view')) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ 檢查權限時發生錯誤:', error);
      return false;
    }
  },

  // 獲取用戶需要審核的加班申請
  async getUserApprovalRequests(userId: string): Promise<any[]> {
    try {
      console.log('🔍 獲取用戶審核申請:', userId);
      
      const { data, error } = await supabase
        .from('overtime_requests')
        .select(`
          *,
          staff!staff_id (
            name,
            department,
            position
          ),
          overtime_approval_records (
            id,
            overtime_request_id,
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
        .eq('current_approver', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 獲取審核申請失敗:', error);
        throw error;
      }

      console.log('✅ 成功獲取審核申請:', data?.length || 0, '筆');
      return data || [];
    } catch (error) {
      console.error('❌ getUserApprovalRequests 失敗:', error);
      throw new Error(`獲取審核申請失敗: ${error.message || '未知錯誤'}`);
    }
  }
};
