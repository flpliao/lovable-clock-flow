
import { supabase } from '@/integrations/supabase/client';
import { OvertimeRequest } from './types';

export const createOvertimeService = {
  async createOvertimeRequest(overtimeData: OvertimeRequest) {
    console.log('🔄 創建加班申請:', overtimeData);
    
    // 檢查申請人是否有上級主管
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('supervisor_id, name')
      .eq('id', overtimeData.staff_id)
      .maybeSingle();

    if (staffError) {
      console.error('❌ 查詢員工資料失敗:', staffError);
      throw staffError;
    }

    // 根據是否有主管決定初始狀態
    const hasSupervisor = staffData?.supervisor_id;
    const initialStatus = hasSupervisor ? 'pending' : 'approved';
    const currentTime = new Date().toISOString();

    console.log('👤 員工資料:', {
      name: staffData?.name,
      hasSupervisor,
      initialStatus
    });

    const insertData = {
      staff_id: overtimeData.staff_id,
      overtime_date: overtimeData.overtime_date,
      start_time: overtimeData.start_time,
      end_time: overtimeData.end_time,
      overtime_type: overtimeData.overtime_type,
      compensation_type: overtimeData.compensation_type,
      reason: overtimeData.reason,
      hours: overtimeData.hours,
      status: initialStatus,
      approval_level: 1,
      ...(initialStatus === 'approved' && {
        approved_by: 'system',
        approved_by_name: '系統自動核准',
        approval_date: currentTime,
        approval_comment: '無主管設定，系統自動核准'
      })
    };

    const { data, error } = await supabase
      .from('overtimes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建加班申請失敗:', error);
      throw error;
    }

    // 如果直接核准，同時創建審核記錄
    if (initialStatus === 'approved') {
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .insert({
          overtime_id: data.id,
          approver_id: null,
          approver_name: '系統自動核准',
          level: 1,
          status: 'approved',
          approval_date: currentTime,
          comment: '無主管設定，系統自動核准'
        });

      if (recordError) {
        console.warn('⚠️ 創建審核記錄失敗:', recordError);
      } else {
        console.log('✅ 系統自動核准記錄創建成功');
      }
    }

    console.log('✅ 加班申請創建成功:', { id: data.id, status: initialStatus });
    return data;
  }
};
