
import { supabase } from '@/integrations/supabase/client';

export const approvalOvertimeService = {
  async approveOvertimeRequest(overtimeId: string, approverId: string, approverName: string, comment?: string) {
    console.log('🚀 核准加班申請:', { overtimeId, approverId, approverName, comment });
    
    try {
      // 1. 更新加班申請狀態
      const { error: updateError } = await supabase
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

      if (updateError) {
        console.error('❌ 更新加班申請狀態失敗:', updateError);
        throw updateError;
      }

      // 2. 更新審核記錄
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: 'approved',
          approval_date: new Date().toISOString(),
          comment: comment || '主管核准'
        })
        .eq('overtime_id', overtimeId)
        .eq('approver_id', approverId)
        .eq('status', 'pending');

      if (recordError) {
        console.error('❌ 更新加班審核記錄失敗:', recordError);
        // 不拋出錯誤，因為主要操作已完成
      } else {
        console.log('✅ 加班審核記錄更新成功');
      }

      console.log('✅ 加班申請核准成功');
    } catch (error) {
      console.error('❌ 核准加班申請失敗:', error);
      throw error;
    }
  },

  async rejectOvertimeRequest(overtimeId: string, approverId: string, approverName: string, reason: string) {
    console.log('🚀 拒絕加班申請:', { overtimeId, approverId, approverName, reason });
    
    try {
      // 1. 更新加班申請狀態
      const { error: updateError } = await supabase
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

      if (updateError) {
        console.error('❌ 更新加班申請狀態失敗:', updateError);
        throw updateError;
      }

      // 2. 更新審核記錄
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: 'rejected',
          approval_date: new Date().toISOString(),
          comment: reason
        })
        .eq('overtime_id', overtimeId)
        .eq('approver_id', approverId)
        .eq('status', 'pending');

      if (recordError) {
        console.error('❌ 更新加班審核記錄失敗:', recordError);
        // 不拋出錯誤，因為主要操作已完成
      } else {
        console.log('✅ 加班審核記錄更新成功');
      }

      console.log('✅ 加班申請拒絕成功');
    } catch (error) {
      console.error('❌ 拒絕加班申請失敗:', error);
      throw error;
    }
  },

  async getOvertimeApprovalHistory(overtimeId: string) {
    console.log('🔍 查詢加班審核歷史:', overtimeId);
    
    const { data, error } = await supabase
      .from('overtime_approval_records')
      .select('*')
      .eq('overtime_id', overtimeId)
      .order('level', { ascending: true });

    if (error) {
      console.error('❌ 查詢加班審核歷史失敗:', error);
      throw error;
    }

    console.log('✅ 查詢加班審核歷史成功:', data?.length, '筆記錄');
    return data || [];
  }
};
