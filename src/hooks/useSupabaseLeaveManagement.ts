
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest } from '@/types';
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
      setLeaveRequests(data || []);
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
  const createLeaveRequest = useCallback(async (newRequest: LeaveRequest): Promise<boolean> => {
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
      console.log('📋 useSupabaseLeaveManagement: 申請資料:', newRequest);

      // 確保使用正確的用戶ID
      const requestData = {
        ...newRequest,
        user_id: currentUser.id,
        staff_id: currentUser.id, // 確保 staff_id 也設定
        id: undefined, // 讓資料庫自動生成
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 useSupabaseLeaveManagement: 準備插入的資料:', requestData);

      const { data, error } = await supabase
        .from('leave_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: 插入請假申請失敗:', error);
        
        // 根據錯誤類型提供更具體的錯誤訊息
        let errorMessage = "無法提交請假申請";
        if (error.message.includes('row-level security')) {
          errorMessage = "權限不足，無法提交請假申請";
        } else if (error.message.includes('violates')) {
          errorMessage = "資料驗證失敗，請檢查填寫內容";
        }

        toast({
          title: "申請失敗",
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
        description: "系統發生錯誤，請稍後重試",
        variant: "destructive",
      });
      return false;
    }
  }, [currentUser?.id, toast, loadLeaveRequests]);

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
    refreshData
  };
};
