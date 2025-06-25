
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { overtimeApprovalService } from '@/services/overtime/overtimeApprovalService';
import { queryOvertimeService } from '@/services/overtime/queryOvertimeService';

interface OvertimeApprovalRecord {
  id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: string;
  approval_date: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

interface OvertimeRequestWithApplicant {
  id: string;
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
  approval_level?: number;
  current_approver?: string;
  supervisor_hierarchy?: any;
  approved_by?: string;
  approved_by_name?: string;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  staff?: {
    name: string;
    department: string;
    position: string;
    supervisor_id?: string;
  };
  overtime_approval_records?: OvertimeApprovalRecord[];
}

export const useOvertimeRequests = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequestWithApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOvertimeRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setIsLoading(true);
      console.log('🔍 載入待審核加班申請，當前用戶:', currentUser.id, currentUser.name);
      
      const requests = await overtimeApprovalService.getPendingOvertimeRequestsForApprover(currentUser.id);
      
      // 格式化資料，確保類型安全
      const formattedData: OvertimeRequestWithApplicant[] = requests.map(item => ({
        ...item,
        staff: Array.isArray(item.staff) ? item.staff[0] : item.staff,
        overtime_approval_records: Array.isArray(item.overtime_approval_records) 
          ? item.overtime_approval_records 
          : [],
        supervisor_hierarchy: item.supervisor_hierarchy || []
      }));

      console.log('✅ 成功載入待審核加班申請:', formattedData.length, '筆');
      console.log('📋 篩選後的申請列表:', formattedData.map(req => ({
        id: req.id,
        applicant: req.staff?.name,
        date: req.overtime_date,
        status: req.status,
        currentApprover: req.current_approver,
        approvalLevel: req.approval_level
      })));
      
      setOvertimeRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入加班申請時發生錯誤:', error);
      setOvertimeRequests([]);
      toast({
        title: "載入失敗",
        description: "無法載入待審核的加班申請，請稍後重試",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, currentUser?.name, toast]);

  const handleOvertimeApproval = useCallback(async (
    requestId: string, 
    action: 'approved' | 'rejected', 
    reason?: string
  ) => {
    if (!currentUser) return;
    
    try {
      console.log('🔄 處理加班審核:', { requestId, action, reason, approver: currentUser.name });
      
      if (action === 'approved') {
        await overtimeApprovalService.approveOvertimeRequest(
          requestId, 
          currentUser.id, 
          currentUser.name || '主管', 
          reason || '主管核准'
        );
        toast({
          title: "申請已核准",
          description: "加班申請已核准",
        });
      } else {
        await overtimeApprovalService.rejectOvertimeRequest(
          requestId, 
          currentUser.id, 
          currentUser.name || '主管', 
          reason || '主管拒絕'
        );
        toast({
          title: "申請已拒絕",
          description: "加班申請已拒絕",
          variant: "destructive"
        });
      }

      // 從列表中移除已處理的申請
      setOvertimeRequests(prev => prev.filter(req => req.id !== requestId));
      
      console.log('✅ 加班審核處理完成');
    } catch (error) {
      console.error('❌ 審核失敗:', error);
      toast({
        title: "審核失敗",
        description: error instanceof Error ? error.message : "無法處理申請，請稍後重試",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  const refreshOvertimeRequests = useCallback(() => {
    return loadOvertimeRequests();
  }, [loadOvertimeRequests]);

  return {
    overtimeRequests,
    isLoading,
    loadOvertimeRequests,
    handleOvertimeApproval,
    refreshOvertimeRequests,
    setOvertimeRequests
  };
};
