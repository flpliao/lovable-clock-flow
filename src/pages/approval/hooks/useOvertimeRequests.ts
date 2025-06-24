
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { overtimeService } from '@/services/overtimeService';

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
  staff?: {
    name: string;
    department: string;
    position: string;
    supervisor_id?: string;
  };
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
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入加班申請失敗:', error);
        return;
      }

      // 根據兩種審核權限條件篩選申請
      const formattedData = (data || [])
        .filter(request => {
          const staffData = Array.isArray(request.staff) ? request.staff[0] : request.staff;
          
          // 條件1：我是申請人的 supervisor_id
          const isDirectSupervisor = staffData && staffData.supervisor_id === currentUser.id;
          
          // 條件2：我是 overtime.current_approver
          const isCurrentApprover = request.current_approver === currentUser.id;
          
          console.log('🔍 檢查審核權限:', {
            requestId: request.id,
            applicantName: staffData?.name,
            isDirectSupervisor,
            isCurrentApprover,
            staffSupervisorId: staffData?.supervisor_id,
            currentApprover: request.current_approver,
            currentUserId: currentUser.id
          });
          
          // 符合任一條件即可顯示
          return isDirectSupervisor || isCurrentApprover;
        })
        .map(item => ({
          ...item,
          staff: Array.isArray(item.staff) ? item.staff[0] : item.staff
        }));

      console.log('✅ 成功載入待審核加班申請:', formattedData.length, '筆');
      console.log('📋 篩選後的申請列表:', formattedData.map(req => ({
        id: req.id,
        applicant: req.staff?.name,
        date: req.overtime_date,
        status: req.status
      })));
      
      setOvertimeRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入加班申請時發生錯誤:', error);
    }
  }, [currentUser?.id, currentUser?.name]);

  const handleOvertimeApproval = useCallback(async (requestId: string, action: 'approved' | 'rejected', reason?: string) => {
    if (!currentUser) return;
    try {
      if (action === 'approved') {
        await overtimeService.approveOvertimeRequest(requestId, currentUser.id, currentUser.name || '主管', '主管核准');
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

      setOvertimeRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('審核失敗:', error);
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
