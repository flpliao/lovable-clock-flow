
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
        status: 'pending'
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
        staff:staff_id (
          name
        )
      `)
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢加班記錄失敗:', error);
      throw error;
    }

    console.log('✅ 查詢加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  }
};
