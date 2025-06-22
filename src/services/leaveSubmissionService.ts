
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
  // 檢查是否有直屬主管 - 更嚴格的檢查
  const hasSupervisor = userStaffData?.supervisor_id && 
                       userStaffData.supervisor_id.trim() !== '' && 
                       userStaffData.supervisor_id !== null;
  
  console.log('檢查主管狀態:', {
    supervisor_id: userStaffData?.supervisor_id,
    hasSupervisor,
    userStaffData
  });

  const shouldAutoApprove = !hasSupervisor;

  if (shouldAutoApprove) {
    // 無直屬主管，直接自動核准
    const { data: insertedData, error: insertError } = await supabase
      .from('leave_requests')
      .insert({
        user_id: userId,
        staff_id: userId,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd'),
        leave_type: data.leave_type as any,
        status: 'approved',
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 0,
        current_approver: null,
        approved_at: new Date().toISOString(),
        approved_by: 'system'
      })
      .select()
      .single();

    if (insertError) {
      console.error('自動核准失敗:', insertError);
      throw insertError;
    }

    // 為自動核准創建審核記錄
    await supabase
      .from('approval_records')
      .insert({
        leave_request_id: insertedData.id,
        approver_id: 'system',
        approver_name: '系統',
        status: 'approved',
        level: 0,
        approval_date: new Date().toISOString(),
        comment: '無直屬主管，系統自動核准'
      });

    console.log('自動核准成功:', insertedData);
    return { success: true, autoApproved: true };
  } else {
    // 有直屬主管，需要審核流程
    const leaveRequest = {
      id: '',
      user_id: userId,
      staff_id: userId,
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd'),
      leave_type: data.leave_type as any,
      status: 'pending' as const,
      hours: calculatedHours,
      reason: data.reason,
      approval_level: 1,
      current_approver: userStaffData?.supervisor_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('需要審核，建立請假申請:', leaveRequest);
    return { success: false, autoApproved: false, leaveRequest };
  }
};

// 獲取主管層級信息
export const getSupervisorHierarchy = async (staffId: string): Promise<string[]> => {
  const supervisors: string[] = [];
  let currentStaffId = staffId;
  let depth = 0;
  const maxDepth = 3; // 最多支援3層主管

  while (depth < maxDepth) {
    const { data: staffData } = await supabase
      .from('staff')
      .select('supervisor_id')
      .eq('id', currentStaffId)
      .maybeSingle();

    if (!staffData?.supervisor_id || staffData.supervisor_id.trim() === '') {
      break;
    }

    supervisors.push(staffData.supervisor_id);
    currentStaffId = staffData.supervisor_id;
    depth++;
  }

  return supervisors;
};

// 處理審核動作
export const processLeaveApproval = async (
  leaveRequestId: string,
  approverId: string,
  approverName: string,
  action: 'approve' | 'reject',
  comment?: string
) => {
  try {
    const { data: leaveRequest, error: fetchError } = await supabase
      .from('leave_requests')
      .select('*, staff_id')
      .eq('id', leaveRequestId)
      .single();

    if (fetchError || !leaveRequest) {
      throw new Error('找不到請假申請');
    }

    if (action === 'reject') {
      // 拒絕請假申請
      await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason: comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaveRequestId);

      // 創建拒絕記錄
      await supabase
        .from('approval_records')
        .insert({
          leave_request_id: leaveRequestId,
          approver_id: approverId,
          approver_name: approverName,
          status: 'rejected',
          level: leaveRequest.approval_level,
          approval_date: new Date().toISOString(),
          comment: comment || '已拒絕'
        });

      return { success: true, status: 'rejected' };
    }

    // 核准邏輯：檢查是否需要下一層審核
    const supervisorHierarchy = await getSupervisorHierarchy(leaveRequest.staff_id);
    const currentLevel = leaveRequest.approval_level || 1;
    const isLastLevel = currentLevel >= supervisorHierarchy.length;

    // 創建核准記錄
    await supabase
      .from('approval_records')
      .insert({
        leave_request_id: leaveRequestId,
        approver_id: approverId,
        approver_name: approverName,
        status: 'approved',
        level: currentLevel,
        approval_date: new Date().toISOString(),
        comment: comment || '已核准'
      });

    if (isLastLevel) {
      // 最後一層核准，請假申請完全核准
      await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', leaveRequestId);

      return { success: true, status: 'approved' };
    } else {
      // 需要下一層審核
      const nextApprover = supervisorHierarchy[currentLevel];
      await supabase
        .from('leave_requests')
        .update({
          approval_level: currentLevel + 1,
          current_approver: nextApprover,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaveRequestId);

      return { success: true, status: 'next_level', nextLevel: currentLevel + 1 };
    }
  } catch (error) {
    console.error('處理審核時發生錯誤:', error);
    throw error;
  }
};
