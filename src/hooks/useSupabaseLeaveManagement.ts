import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest, ApprovalRecord } from '@/types';
import { useUser } from '@/contexts/UserContext';

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入請假申請資料
  const loadLeaveRequests = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('❌ useSupabaseLeaveManagement: 沒有當前用戶');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 useSupabaseLeaveManagement: 載入請假申請，用戶ID:', currentUser.id);

      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approvals:approval_records(*)
        `)
        .or(`user_id.eq.${currentUser.id},staff_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: 載入請假申請失敗:', error);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: 成功載入請假申請:', data?.length || 0, '筆');
      
      // 確保 leave_type 和 approvals 符合聯合類型
      const typedData = data?.map(item => ({
        ...item,
        leave_type: item.leave_type as LeaveRequest['leave_type'],
        status: item.status as LeaveRequest['status'],
        approvals: item.approvals?.map((approval: any) => ({
          ...approval,
          status: approval.status as ApprovalRecord['status']
        })) || []
      })) || [];
      
      setLeaveRequests(typedData);
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: 載入請假申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "無法載入請假申請資料",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, toast]);

  // 創建請假申請
  const createLeaveRequest = useCallback(async (newRequest: Omit<LeaveRequest, 'id'>): Promise<boolean> => {
    if (!currentUser?.id) {
      console.error('❌ useSupabaseLeaveManagement: 創建請假申請失敗 - 沒有當前用戶');
      toast({
        title: "提交失敗",
        description: "請先登入系統",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('🚀 useSupabaseLeaveManagement: 開始創建請假申請');
      console.log('👤 當前用戶資訊:', {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      });

      // 檢查用戶認證狀態
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('❌ 用戶認證失敗:', authError);
        toast({
          title: "認證失敗",
          description: "用戶認證已過期，請重新登入",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ 用戶認證確認:', user.id);

      // 確保使用正確的用戶ID
      const requestData = {
        ...newRequest,
        user_id: currentUser.id,
        staff_id: currentUser.id, // 確保 staff_id 也設定
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 移除不必要的欄位
      delete (requestData as any).approvals;
      delete (requestData as any).id;

      console.log('📝 useSupabaseLeaveManagement: 準備插入的資料:', {
        ...requestData,
        // 隱藏敏感資訊，只顯示關鍵欄位
        user_id: requestData.user_id ? '已設定' : '未設定',
        staff_id: requestData.staff_id ? '已設定' : '未設定',
        leave_type: requestData.leave_type,
        start_date: requestData.start_date,
        end_date: requestData.end_date,
        hours: requestData.hours,
        status: requestData.status
      });

      const { data, error } = await supabase
        .from('leave_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: 插入請假申請失敗:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // 根據錯誤類型提供更具體的錯誤訊息
        let errorMessage = "無法提交請假申請";
        let errorTitle = "申請失敗";

        if (error.code === 'PGRST301') {
          errorMessage = "權限不足，無法提交請假申請。請確認您已正確登入且具備相關權限。";
          errorTitle = "權限錯誤";
        } else if (error.code === '23502') {
          errorMessage = "資料不完整，請檢查所有必填欄位是否已填寫。";
          errorTitle = "資料驗證失敗";
        } else if (error.code === '23503') {
          errorMessage = "資料關聯錯誤，請聯繫系統管理員。";
          errorTitle = "資料錯誤";
        } else if (error.message.includes('row-level security')) {
          errorMessage = "安全政策限制，無法提交請假申請。請聯繫系統管理員檢查權限設定。";
          errorTitle = "安全政策錯誤";
        } else if (error.message.includes('violates')) {
          errorMessage = "資料驗證失敗，請檢查填寫內容是否符合規定。";
          errorTitle = "資料驗證失敗";
        }

        // 顯示詳細錯誤給開發者（在 console）
        console.error('🔍 詳細錯誤分析:', {
          錯誤代碼: error.code,
          錯誤訊息: error.message,
          錯誤詳情: error.details,
          錯誤提示: error.hint,
          請求資料: requestData
        });

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ useSupabaseLeaveManagement: 請假申請創建成功:', data);

      // 如果有審核人，創建審核記錄
      if (newRequest.approvals && newRequest.approvals.length > 0) {
        console.log('📝 useSupabaseLeaveManagement: 創建審核記錄...');
        
        const approvalRecords = newRequest.approvals.map(approval => ({
          ...approval,
          leave_request_id: data.id,
          id: undefined // 讓資料庫自動生成
        }));

        const { error: approvalError } = await supabase
          .from('approval_records')
          .insert(approvalRecords);

        if (approvalError) {
          console.warn('⚠️ useSupabaseLeaveManagement: 創建審核記錄失敗:', approvalError);
        } else {
          console.log('✅ useSupabaseLeaveManagement: 審核記錄創建成功');
        }
      }

      toast({
        title: "申請成功",
        description: "請假申請已提交，等待審核",
      });

      // 重新載入請假申請列表
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: 創建請假申請時發生錯誤:', error);
      toast({
        title: "提交失敗",
        description: "系統發生錯誤，請稍後重試或聯繫系統管理員",
        variant: "destructive",
      });
      return false;
    }
  }, [currentUser?.id, toast, loadLeaveRequests]);

  // 載入年假餘額
  const loadAnnualLeaveBalance = useCallback(async (userId: string) => {
    try {
      console.log('🔍 useSupabaseLeaveManagement: 載入年假餘額，用戶ID:', userId);
      
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from('annual_leave_balance')
        .select('*')
        .eq('staff_id', userId)
        .eq('year', currentYear)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ useSupabaseLeaveManagement: 載入年假餘額失敗:', error);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: 年假餘額載入結果:', data);
      return data;
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: 載入年假餘額時發生錯誤:', error);
      return null;
    }
  }, []);

  // 初始化年假餘額
  const initializeAnnualLeaveBalance = useCallback(async (userId: string) => {
    try {
      console.log('🚀 useSupabaseLeaveManagement: 初始化年假餘額，用戶ID:', userId);
      
      const currentYear = new Date().getFullYear();
      
      // 調用 Supabase 函數來初始化年假餘額
      const { error } = await supabase.rpc('initialize_or_update_annual_leave_balance', {
        staff_uuid: userId,
        target_year: currentYear
      });

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: 初始化年假餘額失敗:', error);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: 年假餘額初始化成功');
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: 初始化年假餘額時發生錯誤:', error);
      throw error;
    }
  }, []);

  // 更新請假申請狀態
  const updateLeaveRequestStatus = useCallback(async (
    requestId: string,
    status: 'approved' | 'rejected',
    comment?: string,
    rejectionReason?: string
  ): Promise<boolean> => {
    try {
      console.log('🔄 useSupabaseLeaveManagement: 更新請假申請狀態:', { requestId, status });

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (comment) updateData.approval_comment = comment;
      if (rejectionReason) updateData.rejection_reason = rejectionReason;

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: 更新請假申請狀態失敗:', error);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: 請假申請狀態更新成功');
      
      toast({
        title: "更新成功",
        description: `請假申請已${status === 'approved' ? '核准' : '拒絕'}`,
      });

      // 重新載入請假申請列表
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: 更新請假申請狀態時發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假申請狀態",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadLeaveRequests]);

  // 刷新資料
  const refreshData = useCallback(async () => {
    await loadLeaveRequests();
  }, [loadLeaveRequests]);

  // 組件掛載時載入資料
  useEffect(() => {
    if (currentUser?.id) {
      loadLeaveRequests();
    }
  }, [currentUser?.id, loadLeaveRequests]);

  return {
    leaveRequests,
    loading,
    createLeaveRequest,
    updateLeaveRequestStatus,
    refreshData,
    loadAnnualLeaveBalance,
    initializeAnnualLeaveBalance
  };
};
