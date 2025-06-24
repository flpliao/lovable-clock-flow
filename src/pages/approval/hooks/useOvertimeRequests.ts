
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { overtimeService } from '@/services/overtimeService';

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
  approval_level?: number;
  current_approver?: string;
  approver_id?: string;
  approver_name?: string;
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

  const loadOvertimeRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      console.log('🔍 載入待審核加班申請，當前用戶:', currentUser.id, currentUser.name);
      
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
        console.error('❌ 載入加班申請失敗:', error);
        return;
      }

      // 根據審核權限條件篩選申請
      const formattedData = (data || [])
        .filter(request => {
          const staffData = Array.isArray(request.staff) ? request.staff[0] : request.staff;
          
          // 條件1：我是申請人的 supervisor_id
          const isDirectSupervisor = staffData && staffData.supervisor_id === currentUser.id;
          
          // 條件2：我是 overtime.current_approver
          const isCurrentApprover = request.current_approver === currentUser.id;
          
          // 條件3：我是 overtime.approver_id
          const isAssignedApprover = request.approver_id === currentUser.id;
          
          // 條件4：管理員可以看到所有申請
          const isAdmin = currentUser.role === 'admin';
          
          console.log('🔍 檢查審核權限:', {
            requestId: request.id,
            applicantName: staffData?.name,
            isDirectSupervisor,
            isCurrentApprover,
            isAssignedApprover,
            isAdmin,
            staffSupervisorId: staffData?.supervisor_id,
            currentApprover: request.current_approver,
            approverId: request.approver_id,
            currentUserId: currentUser.id,
            currentUserRole: currentUser.role
          });
          
          // 符合任一條件即可顯示
          return isDirectSupervisor || isCurrentApprover || isAssignedApprover || isAdmin;
        })
        .map(item => ({
          ...item,
          staff: Array.isArray(item.staff) ? item.staff[0] : item.staff,
          overtime_approval_records: Array.isArray(item.overtime_approval_records) 
            ? item.overtime_approval_records 
            : []
        }));

      console.log('✅ 成功載入待審核加班申請:', formattedData.length, '筆');
      console.log('📋 篩選後的申請列表:', formattedData.map(req => ({
        id: req.id,
        applicant: req.staff?.name,
        date: req.overtime_date,
        status: req.status,
        currentApprover: req.current_approver,
        approverId: req.approver_id
      })));
      
      setOvertimeRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入加班申請時發生錯誤:', error);
    }
  }, [currentUser?.id, currentUser?.name, currentUser?.role]);

  const handleOvertimeApproval = useCallback(async (requestId: string, action: 'approved' | 'rejected', reason?: string) => {
    if (!currentUser) return;
    try {
      console.log('🔄 處理加班審核:', { requestId, action, reason, approver: currentUser.name });
      
      if (action === 'approved') {
        await overtimeService.approveOvertimeRequest(requestId, currentUser.id, currentUser.name || '主管', reason || '主管核准');
        toast({
          title: "申請已核准",
          description: "加班申請已核准"
        });
      } else {
        await overtimeService.rejectOvertimeRequest(requestId, currentUser.id, currentUser.name || '主管', reason || '主管拒絕');
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
        description: "無法處理申請，請稍後重試",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  return {
    overtimeRequests,
    loadOvertimeRequests,
    handleOvertimeApproval,
    setOvertimeRequests
  };
};
