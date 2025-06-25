
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApprovalStats {
  todayApproved: number;
  todayRejected: number;
  missedCheckinApproved: number;
  missedCheckinRejected: number;
  overtimeApproved: number;
  overtimeRejected: number;
}

export const useApprovalStats = () => {
  const [approvalStats, setApprovalStats] = useState<ApprovalStats>({
    todayApproved: 0,
    todayRejected: 0,
    missedCheckinApproved: 0,
    missedCheckinRejected: 0,
    overtimeApproved: 0,
    overtimeRejected: 0
  });

  const loadApprovalStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Query today's approved leave requests
      const { data: approvedData } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'approved')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // Query today's rejected leave requests
      const { data: rejectedData } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // Query today's approved missed checkin requests
      const { data: missedApprovedData } = await supabase
        .from('missed_checkin_requests')
        .select('id')
        .eq('status', 'approved')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // Query today's rejected missed checkin requests
      const { data: missedRejectedData } = await supabase
        .from('missed_checkin_requests')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // Query today's approved overtime requests
      const { data: overtimeApprovedData } = await supabase
        .from('overtime_requests')
        .select('id')
        .eq('status', 'approved')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // Query today's rejected overtime requests
      const { data: overtimeRejectedData } = await supabase
        .from('overtime_requests')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      setApprovalStats({
        todayApproved: approvedData?.length || 0,
        todayRejected: rejectedData?.length || 0,
        missedCheckinApproved: missedApprovedData?.length || 0,
        missedCheckinRejected: missedRejectedData?.length || 0,
        overtimeApproved: overtimeApprovedData?.length || 0,
        overtimeRejected: overtimeRejectedData?.length || 0
      });
      
      console.log('✅ 成功載入今日審核統計');
    } catch (error) {
      console.error('❌ 載入今日審核統計時發生錯誤:', error);
    }
  }, []);

  return { approvalStats, loadApprovalStats };
};
