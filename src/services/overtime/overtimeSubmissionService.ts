
import { supabase } from '@/integrations/supabase/client';
import { OvertimeRequest } from './types';

export const overtimeSubmissionService = {
  async submitOvertimeRequest(overtimeData: OvertimeRequest, currentUserId: string) {
    console.log('🚀 提交加班申請:', overtimeData);
    
    try {
      // 確保只能為自己申請
      if (overtimeData.staff_id !== currentUserId) {
        throw new Error('只能為自己申請加班');
      }
      
      const { data, error } = await supabase
        .from('overtimes')
        .insert({
          staff_id: overtimeData.staff_id,  // 必須等於當前用戶ID
          overtime_date: overtimeData.overtime_date,
          start_time: overtimeData.start_time,
          end_time: overtimeData.end_time,
          overtime_type: overtimeData.overtime_type,
          compensation_type: overtimeData.compensation_type,
          reason: overtimeData.reason,
          hours: overtimeData.hours,
          status: 'pending'
        })
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
        .single();

      if (error) {
        console.error('❌ 提交加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 加班申請提交成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 提交加班申請時發生錯誤:', error);
      throw error;
    }
  },

  async getOvertimeApprovalHierarchy(overtimeId: string) {
    console.log('🔍 查詢加班審核階層:', overtimeId);
    
    const { data, error } = await supabase
      .from('overtime_approval_records')
      .select('*')
      .eq('overtime_id', overtimeId)
      .order('level', { ascending: true });

    if (error) {
      console.error('❌ 查詢加班審核階層失敗:', error);
      throw error;
    }

    console.log('✅ 查詢加班審核階層成功:', data?.length, '筆記錄');
    return data || [];
  }
};
