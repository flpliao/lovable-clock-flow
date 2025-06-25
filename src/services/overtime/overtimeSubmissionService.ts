
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
          staff_id: overtimeData.staff_id,
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

  async updateOvertimeRequest(overtimeId: string, updateData: Partial<OvertimeRequest>, currentUserId: string) {
    console.log('🔄 更新加班申請:', { overtimeId, updateData });
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .update({
          overtime_date: updateData.overtime_date,
          start_time: updateData.start_time,
          end_time: updateData.end_time,
          overtime_type: updateData.overtime_type,
          compensation_type: updateData.compensation_type,
          reason: updateData.reason,
          hours: updateData.hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', overtimeId)
        .eq('staff_id', currentUserId) // 確保只能更新自己的申請
        .eq('status', 'pending') // 只能更新待審核的申請
        .select()
        .single();

      if (error) {
        console.error('❌ 更新加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 加班申請更新成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 更新加班申請時發生錯誤:', error);
      throw error;
    }
  },

  async cancelOvertimeRequest(overtimeId: string, currentUserId: string) {
    console.log('🗑️ 取消加班申請:', overtimeId);
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', overtimeId)
        .eq('staff_id', currentUserId) // 確保只能取消自己的申請
        .eq('status', 'pending') // 只能取消待審核的申請
        .select()
        .single();

      if (error) {
        console.error('❌ 取消加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 加班申請取消成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 取消加班申請時發生錯誤:', error);
      throw error;
    }
  }
};
