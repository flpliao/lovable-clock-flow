
import { supabase } from '@/integrations/supabase/client';

export const approvalOvertimeService = {
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

    // 創建審核記錄
    const { error: recordError } = await supabase
      .from('overtime_approval_records')
      .insert({
        overtime_id: overtimeId,
        approver_id: approverId,
        approver_name: approverName,
        level: 1,
        status: 'approved',
        approval_date: new Date().toISOString(),
        comment: comment || '主管核准'
      });

    if (recordError) {
      console.error('❌ 創建加班審核記錄失敗:', recordError);
      // 不拋出錯誤，因為主要操作已完成
    } else {
      console.log('✅ 加班審核記錄創建成功');
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

    // 創建審核記錄
    const { error: recordError } = await supabase
      .from('overtime_approval_records')
      .insert({
        overtime_id: overtimeId,
        approver_id: approverId,
        approver_name: approverName,
        level: 1,
        status: 'rejected',
        approval_date: new Date().toISOString(),
        comment: reason
      });

    if (recordError) {
      console.error('❌ 創建加班審核記錄失敗:', recordError);
      // 不拋出錯誤，因為主要操作已完成
    } else {
      console.log('✅ 加班審核記錄創建成功');
    }

    console.log('✅ 加班申請拒絕成功');
  }
};
