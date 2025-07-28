import { useToast } from '@/hooks/useToast';
import { leaveRequestService } from '@/services/leaveRequestService';
import { LeaveRequest } from '@/types';
import { useState } from 'react';

export const useLeaveRecordCrud = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 刪除請假記錄
  const deleteLeaveRecord = async (leaveId: string) => {
    try {
      setLoading(true);
      console.log('刪除請假記錄:', leaveId);

      await leaveRequestService.deleteLeaveRequest(leaveId);

      toast({
        title: '刪除成功',
        description: '請假記錄已成功刪除',
      });

      return true;
    } catch (error) {
      console.error('刪除請假記錄失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除請假記錄',
        variant: 'destructive',
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

      // 根據更新資料的類型決定使用哪個方法
      if (updateData.status === 'approved' || updateData.status === 'rejected') {
        const action = updateData.status === 'approved' ? 'approve' : 'reject';
        await leaveRequestService.updateLeaveRequest(leaveId, action);
      } else {
        // 對於其他更新，可能需要使用不同的方法
        console.warn('不支援的更新類型:', updateData);
        throw new Error('不支援的更新類型');
      }

      toast({
        title: '更新成功',
        description: '請假記錄已成功更新',
      });

      return true;
    } catch (error) {
      console.error('更新請假記錄失敗:', error);
      toast({
        title: '更新失敗',
        description: '無法更新請假記錄',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteLeaveRecord,
    updateLeaveRecord,
  };
};
