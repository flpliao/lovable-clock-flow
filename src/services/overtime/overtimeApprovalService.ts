import { supabase } from '@/integrations/supabase/client';
import type { SupervisorHierarchyItem } from './types';

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
        .eq('current_approver', approverId) // 確保只能審核分配給自己的申請
        .eq('status', 'pending')
        .single();

      if (fetchError || !overtimeData) {
        console.error('❌ 獲取加班申請資訊失敗:', fetchError);
        throw new Error('無法找到需要審核的加班申請');
      }

      // 2. 更新當前層級的審核記錄
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: 'approved',
          approval_date: new Date().toISOString(),
          comment: comment || '主管核准',
          updated_at: new Date().toISOString()
        })
        .eq('overtime_id', overtimeId)
        .eq('level', overtimeData.approval_level || 1)
        .eq('approver_id', approverId);

      if (recordError) {
        console.error('❌ 更新審核記錄失敗:', recordError);
        throw recordError;
      }

      // 3. 檢查是否還有下一層審核
      const supervisorHierarchy = overtimeData.supervisor_hierarchy as SupervisorHierarchyItem[] || [];
      const currentLevel = overtimeData.approval_level || 1;
      const hasNextLevel = Array.isArray(supervisorHierarchy) && currentLevel < supervisorHierarchy.length;

      if (hasNextLevel) {
        // 還有下一層審核，更新為下一層
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

          // 更新下一層審核記錄狀態為 pending
          const { error: nextRecordError } = await supabase
            .from('overtime_approval_records')
            .update({ 
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('overtime_id', overtimeId)
            .eq('level', nextLevel);

          if (nextRecordError) {
            console.error('❌ 更新下一層審核記錄失敗:', nextRecordError);
          }

          console.log('✅ 加班申請已轉至下一層審核');
        }
      } else {
        // 最後一層，直接核准申請
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
      // 1. 驗證審核權限
      const { data: overtimeData, error: fetchError } = await supabase
        .from('overtimes')
        .select('id, staff_id, current_approver, status')
        .eq('id', overtimeId)
        .eq('current_approver', approverId)
        .eq('status', 'pending')
        .single();

      if (fetchError || !overtimeData) {
        console.error('❌ 驗證審核權限失敗:', fetchError);
        throw new Error('無法找到需要審核的加班申請');
      }

      // 2. 更新加班申請狀態為拒絕
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

      // 3. 更新當前層級的審核記錄
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: 'rejected',
          approval_date: new Date().toISOString(),
          comment: reason,
          updated_at: new Date().toISOString()
        })
        .eq('overtime_id', overtimeId)
        .eq('approver_id', approverId)
        .eq('status', 'pending');

      if (recordError) {
        console.error('❌ 更新審核記錄失敗:', recordError);
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
