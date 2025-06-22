
import { differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { UserStaffData } from './staffDataService';

export interface LeaveSubmissionData {
  start_date: Date;
  end_date: Date;
  leave_type: string;
  reason: string;
}

export interface LeaveRequestData {
  user_id: string;
  staff_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  status: 'pending' | 'approved';
  hours: number;
  reason: string;
  approval_level?: number;
  current_approver?: string;
}

export interface SubmissionResult {
  autoApproved: boolean;
  leaveRequest?: LeaveRequestData;
}

// 獲取用戶的主管階層
export const getSupervisorHierarchy = async (userId: string): Promise<Array<{id: string, name: string, level: number}>> => {
  try {
    console.log('🔍 獲取主管階層，用戶ID:', userId);
    
    const hierarchy: Array<{id: string, name: string, level: number}> = [];
    let currentUserId = userId;
    let level = 1;

    // 最多查詢 5 層主管階層，避免無限循環
    while (level <= 5) {
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('supervisor_id, name')
        .eq('id', currentUserId)
        .maybeSingle();

      if (error) {
        console.error(`❌ 查詢第${level}層主管失敗:`, error);
        break;
      }

      if (!staffData || !staffData.supervisor_id) {
        console.log(`📋 第${level}層：沒有找到主管`);
        break;
      }

      // 獲取主管資訊
      const { data: supervisorData, error: supervisorError } = await supabase
        .from('staff')
        .select('id, name')
        .eq('id', staffData.supervisor_id)
        .maybeSingle();

      if (supervisorError || !supervisorData) {
        console.error(`❌ 查詢第${level}層主管資訊失敗:`, supervisorError);
        break;
      }

      hierarchy.push({
        id: supervisorData.id,
        name: supervisorData.name,
        level: level
      });

      console.log(`✅ 第${level}層主管:`, supervisorData.name, supervisorData.id);

      currentUserId = staffData.supervisor_id;
      level++;

      // 避免循環參照
      if (currentUserId === userId) {
        console.warn('⚠️ 檢測到循環參照，停止查詢');
        break;
      }
    }

    console.log('📊 主管階層查詢完成，共', hierarchy.length, '層');
    return hierarchy;
  } catch (error) {
    console.error('❌ 獲取主管階層時發生錯誤:', error);
    return [];
  }
};

// 建立審核記錄
const createApprovalRecords = async (leaveRequestId: string, supervisorHierarchy: Array<{id: string, name: string, level: number}>) => {
  try {
    console.log('📝 建立審核記錄，請假申請ID:', leaveRequestId);
    
    if (supervisorHierarchy.length === 0) {
      console.log('⚠️ 無主管階層，跳過建立審核記錄');
      return;
    }

    const approvalRecords = supervisorHierarchy.map(supervisor => ({
      leave_request_id: leaveRequestId,
      approver_id: supervisor.id,
      approver_name: supervisor.name,
      status: 'pending' as const,
      level: supervisor.level
    }));

    console.log('📋 準備建立的審核記錄:', approvalRecords);

    const { error } = await supabase
      .from('approval_records')
      .insert(approvalRecords);

    if (error) {
      console.error('❌ 建立審核記錄失敗:', error);
      throw error;
    }

    console.log('✅ 審核記錄建立成功');
  } catch (error) {
    console.error('❌ 建立審核記錄時發生錯誤:', error);
    throw error;
  }
};

export const submitLeaveRequest = async (
  submissionData: LeaveSubmissionData,
  userId: string,
  calculatedHours: number,
  userStaffData: UserStaffData
): Promise<SubmissionResult> => {
  try {
    console.log('🚀 開始提交請假申請流程');
    console.log('📋 申請資料:', submissionData);
    console.log('👤 申請人ID:', userId);
    console.log('⏰ 計算時數:', calculatedHours);

    // 獲取主管階層
    const supervisorHierarchy = await getSupervisorHierarchy(userId);
    console.log('👨‍💼 主管階層:', supervisorHierarchy);

    // 如果沒有主管，則自動核准
    if (supervisorHierarchy.length === 0) {
      console.log('🔄 無主管階層，執行自動核准流程');
      
      const autoApprovedRequest: LeaveRequestData = {
        user_id: userId,
        staff_id: userId,
        start_date: submissionData.start_date.toISOString().split('T')[0],
        end_date: submissionData.end_date.toISOString().split('T')[0],
        leave_type: submissionData.leave_type,
        status: 'approved',
        hours: calculatedHours,
        reason: submissionData.reason
      };

      // 直接插入已核准的請假申請
      const { data: insertedRequest, error: insertError } = await supabase
        .from('leave_requests')
        .insert(autoApprovedRequest)
        .select()
        .single();

      if (insertError) {
        console.error('❌ 插入自動核准請假申請失敗:', insertError);
        throw insertError;
      }

      // 建立自動核准的審核記錄
      const { error: approvalError } = await supabase
        .from('approval_records')
        .insert({
          leave_request_id: insertedRequest.id,
          approver_id: userId, // 使用申請人自己的ID
          approver_name: userStaffData.name,
          status: 'approved',
          level: 1,
          comment: '系統自動核准（無設定直屬主管）',
          approval_date: new Date().toISOString()
        });

      if (approvalError) {
        console.warn('⚠️ 建立自動核准審核記錄失敗:', approvalError);
        // 不拋出錯誤，因為主要流程已完成
      }

      console.log('✅ 自動核准流程完成');
      return {
        autoApproved: true
      };
    }

    // 有主管的情況，建立待審核申請
    console.log('👨‍💼 進入主管審核流程');
    
    const pendingRequest: LeaveRequestData = {
      user_id: userId,
      staff_id: userId,
      start_date: submissionData.start_date.toISOString().split('T')[0],
      end_date: submissionData.end_date.toISOString().split('T')[0],
      leave_type: submissionData.leave_type,
      status: 'pending',
      hours: calculatedHours,
      reason: submissionData.reason,
      approval_level: 1,
      current_approver: supervisorHierarchy[0].id // 設置第一層主管為當前審核者
    };

    console.log('📝 準備建立的請假申請:', pendingRequest);

    // 插入請假申請
    const { data: insertedRequest, error: insertError } = await supabase
      .from('leave_requests')
      .insert(pendingRequest)
      .select()
      .single();

    if (insertError) {
      console.error('❌ 插入請假申請失敗:', insertError);
      throw insertError;
    }

    console.log('✅ 請假申請插入成功，ID:', insertedRequest.id);

    // 建立審核記錄
    await createApprovalRecords(insertedRequest.id, supervisorHierarchy);

    return {
      autoApproved: false,
      leaveRequest: {
        ...pendingRequest,
        // 確保返回正確的資料格式
        approval_level: 1,
        current_approver: supervisorHierarchy[0].id
      }
    };

  } catch (error) {
    console.error('❌ 提交請假申請失敗:', error);
    throw error;
  }
};
