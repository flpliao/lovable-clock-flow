
import { supabase } from '@/integrations/supabase/client';

export interface OvertimeRequest {
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  hours: number;
}

export interface OvertimeRecord {
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
  approved_by?: string;
  approved_by_name?: string;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  compensation_hours?: number;
  staff?: {
    name: string;
  };
  approvals?: OvertimeApprovalRecord[];
}

export interface OvertimeApprovalRecord {
  id: string;
  overtime_id: string;
  approver_id: string;
  approver_name: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  approval_date?: string;
  comment?: string;
}

export const overtimeService = {
  async createOvertimeRequest(overtimeData: OvertimeRequest) {
    console.log('🔄 創建加班申請:', overtimeData);
    
    const { data, error } = await supabase
      .from('overtimes')
      .insert({
        staff_id: overtimeData.staff_id,
        overtime_date: overtimeData.overtime_date,
        start_time: overtimeData.start_time,
        end_time: overtimeData.end_time,
        overtime_type: overtimeData.overtime_type,
        compensation_type: overtimeData.compensation_type,
        reason: overtimeData.reason,
        hours: overtimeData.hours,
        status: 'pending',
        approval_level: 1
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 創建加班申請失敗:', error);
      throw error;
    }

    console.log('✅ 加班申請創建成功:', data);
    return data;
  },

  async getOvertimeRequestsByStaff(staffId: string) {
    console.log('🔍 查詢員工加班記錄:', staffId);
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name
        ),
        overtime_approval_records (*)
      `)
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢加班記錄失敗:', error);
      throw error;
    }

    console.log('✅ 查詢加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  async getPendingOvertimeRequests() {
    console.log('🔍 查詢待審核加班申請');
    
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
        overtime_approval_records (*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢待審核加班申請失敗:', error);
      throw error;
    }

    console.log('✅ 查詢待審核加班申請成功:', data?.length, '筆記錄');
    return data || [];
  },

  async approveOvertimeRequest(overtimeId: string, approverId: string, approverName: string, comment?: string) {
    console.log('🚀 核准加班申請:', overtimeId);
    
    const { error } = await supabase
      .from('overtimes')
      .update({
        status: 'approved',
        approved_by: approverId,
        approved_by_name: approverName,
        approval_date: new Date().toISOString(),
        approval_comment: comment || '主管核准',
        updated_at: new Date().toISOString()
      })
      .eq('id', overtimeId);

    if (error) {
      console.error('❌ 核准加班申請失敗:', error);
      throw error;
    }

    // 更新審核記錄
    const { error: approvalError } = await supabase
      .from('overtime_approval_records')
      .update({
        status: 'approved',
        approval_date: new Date().toISOString(),
        comment: comment || '主管核准'
      })
      .eq('overtime_id', overtimeId)
      .eq('approver_id', approverId);

    if (approvalError) {
      console.warn('⚠️ 更新加班審核記錄失敗:', approvalError);
    }

    console.log('✅ 加班申請核准成功');
  },

  async rejectOvertimeRequest(overtimeId: string, approverId: string, approverName: string, reason: string) {
    console.log('🚀 拒絕加班申請:', overtimeId);
    
    const { error } = await supabase
      .from('overtimes')
      .update({
        status: 'rejected',
        approved_by: approverId,
        approved_by_name: approverName,
        approval_date: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', overtimeId);

    if (error) {
      console.error('❌ 拒絕加班申請失敗:', error);
      throw error;
    }

    // 更新審核記錄
    const { error: approvalError } = await supabase
      .from('overtime_approval_records')
      .update({
        status: 'rejected',
        approval_date: new Date().toISOString(),
        comment: reason
      })
      .eq('overtime_id', overtimeId)
      .eq('approver_id', approverId);

    if (approvalError) {
      console.warn('⚠️ 更新加班審核記錄失敗:', approvalError);
    }

    console.log('✅ 加班申請拒絕成功');
  }
};
