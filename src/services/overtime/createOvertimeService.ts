
import { supabase } from '@/integrations/supabase/client';
import { OvertimeRequest } from './types';

export const createOvertimeService = {
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
  }
};
