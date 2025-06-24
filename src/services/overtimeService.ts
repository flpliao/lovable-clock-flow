
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
  static async getUserOvertimeHistory(staffId: string): Promise<OvertimeRequest[]> {
    console.log('🔄 載入用戶加班記錄:', staffId);
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .select('*')
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入加班記錄失敗:', error);
        throw new Error(`載入加班記錄失敗: ${error.message}`);
      }

      console.log('✅ 加班記錄载入成功:', data?.length, '筆記錄');
      return data as OvertimeRequest[];
    } catch (error) {
      console.error('❌ 加班記錄服務錯誤:', error);
      throw error;
    }
  }

  /**
   * 獲取所有加班記錄（HR管理用）
   */
  static async getAllOvertimeRequests(): Promise<OvertimeRequest[]> {
    console.log('🔄 載入所有加班記錄');
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .select(`
          *,
          staff:staff_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入所有加班記錄失敗:', error);
        throw new Error(`載入加班記錄失敗: ${error.message}`);
      }

      console.log('✅ 所有加班記錄載入成功:', data?.length, '筆記錄');
      return data as OvertimeRequest[];
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
