
import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRecord } from './types';

export const queryOvertimeService = {
  async getOvertimeRequestsByCurrentUser(userId: string): Promise<OvertimeRecord[]> {
    console.log('🔍 查詢用戶加班申請:', userId);
    
    try {
      // 首先驗證用戶是否為有效員工
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .eq('id', userId)
        .single();

      if (staffError || !staffData) {
        console.warn('⚠️ 用戶不是有效員工:', userId);
        return [];
      }

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
            overtime_id,
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
        .eq('staff_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 查詢加班申請成功:', data?.length, '筆記錄');
      return data || [];
    } catch (error) {
      console.error('❌ 查詢加班申請時發生錯誤:', error);
      throw error;
    }
  },

  async getOvertimeRequestById(overtimeId: string, userId: string): Promise<OvertimeRecord | null> {
    console.log('🔍 查詢加班申請詳情:', { overtimeId, userId });
    
    try {
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
            overtime_id,
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
        .eq('id', overtimeId)
        .eq('staff_id', userId)
        .single();

      if (error) {
        console.error('❌ 查詢加班申請詳情失敗:', error);
        throw error;
      }

      console.log('✅ 查詢加班申請詳情成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 查詢加班申請詳情時發生錯誤:', error);
      throw error;
    }
  },

  async getAllOvertimeRequests(): Promise<OvertimeRecord[]> {
    console.log('🔍 查詢所有加班申請');
    
    try {
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
            overtime_id,
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢所有加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 查詢所有加班申請成功:', data?.length, '筆記錄');
      return data || [];
    } catch (error) {
      console.error('❌ 查詢所有加班申請時發生錯誤:', error);
      throw error;
    }
  }
};
