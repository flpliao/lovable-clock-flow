
import { useState, useCallback } from 'react';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';
import { toast } from 'sonner';

export const useOvertimeRequests = () => {
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOvertimeRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 載入待審核加班申請...');
      
      const requests = await overtimeService.getPendingOvertimeRequests();
      setOvertimeRequests(requests);
      
      console.log('✅ 成功載入加班申請:', requests.length, '筆');
    } catch (error) {
      console.error('❌ 載入加班申請失敗:', error);
      toast.error('載入加班申請失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOvertimeApproval = useCallback(async (
    requestId: string, 
    action: 'approve' | 'reject', 
    comment?: string
  ) => {
    try {
      console.log(`📝 處理加班申請審核: ${action}`, { requestId, comment });
      
      await overtimeService.approveOvertimeRequest(requestId, action, comment);
      
      // 更新本地狀態
      setOvertimeRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );
      
      const message = action === 'approve' ? '加班申請已核准' : '加班申請已拒絕';
      toast.success(message);
      
      console.log('✅ 加班申請審核完成');
    } catch (error) {
      console.error('❌ 加班申請審核失敗:', error);
      toast.error(`加班申請審核失敗：${error?.message || '未知錯誤'}`);
    }
  }, []);

  return {
    overtimeRequests,
    isLoading,
    loadOvertimeRequests,
    handleOvertimeApproval
  };
};
