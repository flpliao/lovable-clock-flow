
import { supabase } from '@/integrations/supabase/client';

export const overtimeApprovalService = {
  async approveOvertimeRequest(
    overtimeId: string, 
    approverId: string, 
    approverName: string, 
    comment?: string
  ) {
    console.log('🚀 核准加班申請:', { overtimeId, approverId, approverName, comment });
    
    try {
      // 1. 獲取當前加班申請資訊
      const { data: overtimeData, error: fetchError } = await supabase
        .from('overtimes')
        .select('*, supervisor_hierarchy, approval_level')
        .eq('id', overtimeId)
        .single();

      if (fetchError) {
        console.error('❌ 獲取加班申請資訊失敗:', fetchError);
        throw fetchError;
      }

      if (!overtimeData) {
        throw new Error('找不到加班申請');
      }

      const supervisorHierarchy = overtimeData.supervisor_hierarchy || [];
      const currentLevel = overtimeData.approval_level || 1;
      const isLastLevel = currentLevel >= supervisorHierarchy.length;

      // 2. 更新當前層級的審核記錄
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: 'approved',
          approval_date: new Date().toISOString(),
          comment: comment || '主管核准'
        })
        .eq('overtime_id', overtimeId)
        .eq('level', currentLevel)
        .eq('approver_id', approverId);

      if (recordError) {
        console.error('❌ 更新審核記錄失敗:', recordError);
        throw recordError;
      }

      // 3. 如果是最後一層，直接核准申請
      if (isLastLevel) {
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

        console.log('✅ 加班申請最終核准成功');
      } else {
        // 4. 還有下一層審核，更新為下一層
        const nextLevel = currentLevel + 1;
        const nextApprover = supervisorHierarchy[nextLevel - 1];
        
        if (nextApprover && nextApprover.supervisor_id) {
          const { error: updateError } = await supabase
            .from('overtimes')
            .update({
              current_approver: nextApprover.supervisor_id,
              approval_level: nextLevel,
              updated_at: new Date().toISOString()
            })
            .eq('id', overtimeId);

          if (updateError) {
            console.error('❌ 更新加班申請審核層級失敗:', updateError);
            throw updateError;
          }

          // 5. 更新下一層審核記錄狀態為 pending
          const { error: nextRecordError } = await supabase
            .from('overtime_approval_records')
            .update({ status: 'pending' })
            .eq('overtime_id', overtimeId)
            .eq('level', nextLevel);

          if (nextRecordError) {
            console.error('❌ 更新下一層審核記錄失敗:', nextRecordError);
          }

          console.log('✅ 加班申請已轉至下一層審核');
        }
      }

      console.log('✅ 加班申請核准處理完成');
    } catch (error) {
      console.error('❌ 核准加班申請失敗:', error);
      throw error;
    }
  },

  async rejectOvertimeRequest(
    overtimeId: string, 
    approverId: string, 
    approverName: string, 
    reason: string
  ) {
    console.log('🚀 拒絕加班申請:', { overtimeId, approverId, approverName, reason });
    
    try {
      // 1. 更新加班申請狀態為拒絕
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

      // 2. 更新當前層級的審核記錄
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
        console.error('❌ 更新審核記錄失敗:', recordError);
        // 不拋出錯誤，因為主要操作已完成
      }

      console.log('✅ 加班申請拒絕成功');
    } catch (error) {
      console.error('❌ 拒絕加班申請失敗:', error);
      throw error;
    }
  },

  async getPendingOvertimeRequestsForApprover(approverId: string) {
    console.log('🔍 查詢需要審核的加班申請:', approverId);
    
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
      .eq('current_approver', approverId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢需要審核的加班申請失敗:', error);
      throw error;
    }

    console.log('✅ 查詢需要審核的加班申請成功:', data?.length, '筆記錄');
    return data || [];
  }
};
