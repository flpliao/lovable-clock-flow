
import { useState } from 'react';
import { LeaveRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { supabase } from '@/integrations/supabase/client';

export const useLeaveRecordCrud = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refreshData } = useLeaveManagementContext();

  // 刪除請假記錄
  const deleteLeaveRecord = async (leaveId: string) => {
    try {
      setLoading(true);
      console.log('刪除請假記錄:', leaveId);

      // 先刪除相關的審核記錄
      const { error: approvalError } = await supabase
        .from('approval_records')
        .delete()
        .eq('leave_request_id', leaveId);

      if (approvalError) {
        console.error('刪除審核記錄失敗:', approvalError);
        throw approvalError;
      }

      // 刪除請假記錄
      const { error: leaveError } = await supabase
        .from('leave_requests')
        .delete()
        .eq('id', leaveId);

      if (leaveError) {
        console.error('刪除請假記錄失敗:', leaveError);
        throw leaveError;
      }

      toast({
        title: "刪除成功",
        description: "請假記錄已成功刪除",
      });

      // 重新載入資料
      await refreshData();
      return true;
    } catch (error) {
      console.error('刪除請假記錄失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除請假記錄",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 更新請假記錄
  const updateLeaveRecord = async (leaveId: string, updateData: Partial<LeaveRequest>) => {
    try {
      setLoading(true);
      console.log('更新請假記錄:', leaveId, updateData);

      const { error } = await supabase
        .from('leave_requests')
        .update({
          start_date: updateData.start_date,
          end_date: updateData.end_date,
          leave_type: updateData.leave_type,
          hours: updateData.hours,
          reason: updateData.reason,
          status: updateData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaveId);

      if (error) {
        console.error('更新請假記錄失敗:', error);
        throw error;
      }

      toast({
        title: "更新成功",
        description: "請假記錄已成功更新",
      });

      // 重新載入資料
      await refreshData();
      return true;
    } catch (error) {
      console.error('更新請假記錄失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假記錄",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteLeaveRecord,
    updateLeaveRecord
  };
};
