
import { supabase } from '@/integrations/supabase/client';
import { overtimeApiService } from './overtimeApiService';

export const overtimeValidationService = {
  // 獲取當前用戶ID - 使用 Supabase Auth JWT token
  async getCurrentUserId(): Promise<string> {
    try {
      console.log('🔍 使用 Supabase Auth 獲取當前用戶ID');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ 無法從 Supabase Auth 獲取用戶:', error);
        throw new Error('用戶未認證');
      }
      
      console.log('✅ 從 Supabase Auth 獲取用戶ID:', user.id);
      return user.id;
    } catch (error) {
      console.error('🔥 獲取 Supabase Auth 用戶ID失敗:', error);
      throw new Error('無法獲取用戶身份');
    }
  },

  // 檢查用戶權限 - 使用 JWT token 進行身份驗證
  async checkUserPermissions(userId: string, permission: string): Promise<boolean> {
    console.log('🔍 使用 Supabase Auth 檢查用戶權限:', { userId, permission });
    
    try {
      // 獲取用戶資訊和角色
      const userInfo = await overtimeApiService.getStaffInfo(userId);
      
      if (!userInfo) {
        console.log('❌ 找不到用戶資料');
        return false;
      }

      console.log('👤 用戶資訊:', {
        id: userInfo.id,
        name: userInfo.name,
        role: userInfo.role,
        department: userInfo.department,
        position: userInfo.position
      });

      // 基本權限檢查 - 所有員工都可以申請加班
      if (permission === 'overtime:create' || permission === 'overtime:view_own') {
        return true;
      }

      // 審核權限檢查 - 管理者角色或有下屬的主管可以審核
      if (permission === 'overtime:approve') {
        const isManager = userInfo.role === 'admin' || userInfo.role === 'manager';
        const hasSubordinates = await this.checkHasSubordinates(userId);
        
        console.log('🔐 審核權限檢查:', {
          role: userInfo.role,
          isManager: isManager,
          hasSubordinates: hasSubordinates,
          canApprove: isManager || hasSubordinates
        });
        
        return isManager || hasSubordinates;
      }

      // 查看所有申請權限 - 只有管理員
      if (permission === 'overtime:view_all') {
        return userInfo.role === 'admin';
      }

      return false;
    } catch (error) {
      console.error('❌ 權限檢查失敗:', error);
      return false;
    }
  },

  // 檢查是否有下屬 - 使用 JWT token 進行身份驗證
  async checkHasSubordinates(userId: string): Promise<boolean> {
    try {
      const subordinates = await overtimeApiService.getSubordinates(userId);
      return subordinates.length > 0;
    } catch (error) {
      console.error('❌ 檢查下屬關係失敗:', error);
      return false;
    }
  },

  // 獲取用戶的審核申請 - 使用 JWT token 進行身份驗證
  async getUserApprovalRequests(userId: string): Promise<any[]> {
    console.log('🔍 使用 Supabase Auth 獲取用戶需要審核的加班申請');
    
    try {
      // 獲取當前認證用戶
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ 無法獲取當前用戶:', authError);
        throw new Error('用戶未認證');
      }
      
      // 1. 直接指派的審核申請
      const directAssigned = await supabase
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

      // 2. 透過審核記錄表查詢的申請
      const throughApprovalRecords = await supabase
        .from('overtime_approval_records')
        .select(`
          overtime_request_id,
          overtime_requests!inner (
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
          )
        `)
        .eq('approver_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // 3. 主管關係查詢 - 查詢下屬的申請
      const subordinateRequests = await supabase
        .from('overtime_requests')
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
        .eq('staff.supervisor_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // 合併去重
      const allRequests = new Map();
      
      directAssigned.data?.forEach(req => allRequests.set(req.id, req));
      throughApprovalRecords.data?.forEach(item => 
        allRequests.set(item.overtime_request_id, item.overtime_requests)
      );
      subordinateRequests.data?.forEach(req => allRequests.set(req.id, req));

      const result = Array.from(allRequests.values());
      
      console.log('📋 查詢結果統計:', {
        直接指派: directAssigned.data?.length || 0,
        審核記錄: throughApprovalRecords.data?.length || 0,
        下屬申請: subordinateRequests.data?.length || 0,
        總計: result.length
      });

      return result;
    } catch (error) {
      console.error('❌ 獲取審核申請失敗:', error);
      return [];
    }
  },

  // 計算加班時數
  calculateOvertimeHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
};
