
import { supabase } from '@/integrations/supabase/client';

export interface OvertimeRequest {
  id?: string;
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approval_date?: string;
  approval_comment?: string;
  created_at?: string;
  updated_at?: string;
  // 新增 staff 關聯資料
  staff?: {
    name: string;
  };
}

export interface OvertimeRecord {
  id: string;
  staff_name: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export class OvertimeService {
  /**
   * 提交加班申請
   */
  static async submitOvertimeRequest(request: Omit<OvertimeRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<OvertimeRequest> {
    console.log('🔄 提交加班申請:', request);
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .insert([{
          ...request,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ 提交加班申請失敗:', error);
        throw new Error(`加班申請提交失敗: ${error.message}`);
      }

      console.log('✅ 加班申請提交成功:', data);
      return data as OvertimeRequest;
    } catch (error) {
      console.error('❌ 加班申請服務錯誤:', error);
      throw error;
    }
  }

  /**
   * 獲取用戶的加班記錄
   */
  static async getUserOvertimeHistory(staffId: string): Promise<OvertimeRecord[]> {
    console.log('🔄 載入用戶加班記錄:', staffId);
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .select(`
          id,
          overtime_date,
          start_time,
          end_time,
          hours,
          overtime_type,
          compensation_type,
          reason,
          status,
          created_at,
          staff:staff_id!inner (
            name
          )
        `)
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入加班記錄失敗:', error);
        throw new Error(`載入加班記錄失敗: ${error.message}`);
      }

      console.log('✅ 加班記錄載入成功:', data?.length, '筆記錄');
      
      // 轉換為 OvertimeRecord 格式
      const records: OvertimeRecord[] = (data || []).map(item => ({
        id: item.id,
        staff_name: (item.staff as any)?.name || '未知員工',
        overtime_date: item.overtime_date,
        start_time: item.start_time,
        end_time: item.end_time,
        hours: item.hours,
        overtime_type: item.overtime_type as 'weekday' | 'weekend' | 'holiday',
        compensation_type: item.compensation_type as 'pay' | 'time_off' | 'both',
        reason: item.reason,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at
      }));

      return records;
    } catch (error) {
      console.error('❌ 加班記錄服務錯誤:', error);
      throw error;
    }
  }

  /**
   * 獲取所有加班記錄（HR管理用）
   */
  static async getAllOvertimeRequests(): Promise<OvertimeRecord[]> {
    console.log('🔄 載入所有加班記錄');
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .select(`
          id,
          overtime_date,
          start_time,
          end_time,
          hours,
          overtime_type,
          compensation_type,
          reason,
          status,
          created_at,
          staff:staff_id!inner (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入所有加班記錄失敗:', error);
        throw new Error(`載入加班記錄失敗: ${error.message}`);
      }

      console.log('✅ 所有加班記錄載入成功:', data?.length, '筆記錄');
      
      // 轉換為 OvertimeRecord 格式
      const records: OvertimeRecord[] = (data || []).map(item => ({
        id: item.id,
        staff_name: (item.staff as any)?.name || '未知員工',
        overtime_date: item.overtime_date,
        start_time: item.start_time,
        end_time: item.end_time,
        hours: item.hours,
        overtime_type: item.overtime_type as 'weekday' | 'weekend' | 'holiday',
        compensation_type: item.compensation_type as 'pay' | 'time_off' | 'both',
        reason: item.reason,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at
      }));

      return records;
    } catch (error) {
      console.error('❌ 加班記錄服務錯誤:', error);
      throw error;
    }
  }

  /**
   * 審核加班申請
   */
  static async approveOvertimeRequest(
    overtimeId: string, 
    approverId: string, 
    status: 'approved' | 'rejected',
    comment?: string
  ): Promise<OvertimeRequest> {
    console.log('🔄 審核加班申請:', { overtimeId, status, comment });
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .update({
          status,
          approved_by: approverId,
          approval_date: new Date().toISOString(),
          approval_comment: comment || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', overtimeId)
        .select()
        .single();

      if (error) {
        console.error('❌ 審核加班申請失敗:', error);
        throw new Error(`審核失敗: ${error.message}`);
      }

      console.log('✅ 加班申請審核成功:', data);
      return data as OvertimeRequest;
    } catch (error) {
      console.error('❌ 加班審核服務錯誤:', error);
      throw error;
    }
  }
}
