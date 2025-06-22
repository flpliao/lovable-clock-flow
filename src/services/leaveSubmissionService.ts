
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { UserStaffData } from './staffDataService';

export interface LeaveSubmissionData {
  start_date: Date;
  end_date: Date;
  leave_type: string;
  reason: string;
}

export const submitLeaveRequest = async (
  data: LeaveSubmissionData,
  userId: string,
  calculatedHours: number,
  userStaffData: UserStaffData | null
) => {
  // 檢查是否有直屬主管
  const hasSupervisor = userStaffData?.supervisor_id && userStaffData.supervisor_id.trim() !== '';
  const shouldAutoApprove = !hasSupervisor;

  const leaveRequestStatus: 'approved' | 'pending' = shouldAutoApprove ? 'approved' : 'pending';

  const leaveRequest = {
    id: '',
    user_id: userId,
    staff_id: userId,
    start_date: format(data.start_date, 'yyyy-MM-dd'),
    end_date: format(data.end_date, 'yyyy-MM-dd'),
    leave_type: data.leave_type as any,
    status: leaveRequestStatus,
    hours: calculatedHours,
    reason: data.reason,
    approval_level: shouldAutoApprove ? 0 : 1,
    current_approver: shouldAutoApprove ? null : userStaffData?.supervisor_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 如果自動核准，需要額外處理核准資訊
  if (shouldAutoApprove) {
    const { data: insertedData, error: insertError } = await supabase
      .from('leave_requests')
      .insert({
        ...leaveRequest,
        approved_at: new Date().toISOString(),
        approved_by: 'system'
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return { success: true, autoApproved: true };
  } else {
    return { success: false, autoApproved: false, leaveRequest };
  }
};
