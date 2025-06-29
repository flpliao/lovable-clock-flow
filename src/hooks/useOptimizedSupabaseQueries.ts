
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedPermissions } from './useOptimizedPermissions';

export const useOptimizedSupabaseQueries = () => {
  const { userContext, refreshPermissionsCache } = useOptimizedPermissions();

  // 優化後的員工資料查詢
  const getStaffData = useCallback(async () => {
    try {
      console.log('🔍 使用優化後的 RLS 查詢員工資料...');
      
      // RLS 政策會自動處理權限篩選，無需額外的 WHERE 條件
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢員工資料失敗:', error);
        return { data: [], error };
      }

      console.log('✅ 員工資料查詢成功 (優化後):', data?.length || 0, '筆');
      return { data: data || [], error: null };
      
    } catch (error) {
      console.error('❌ 員工資料查詢時發生錯誤:', error);
      return { data: [], error };
    }
  }, []);

  // 優化後的請假記錄查詢
  const getLeaveRequests = useCallback(async (status?: string) => {
    try {
      console.log('🔍 使用優化後的 RLS 查詢請假記錄...');
      
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name, department)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ 查詢請假記錄失敗:', error);
        return { data: [], error };
      }

      console.log('✅ 請假記錄查詢成功 (優化後):', data?.length || 0, '筆');
      return { data: data || [], error: null };
      
    } catch (error) {
      console.error('❌ 請假記錄查詢時發生錯誤:', error);
      return { data: [], error };
    }
  }, []);

  // 優化後的年假餘額查詢
  const getAnnualLeaveBalance = useCallback(async (year?: number) => {
    try {
      console.log('🔍 使用優化後的 RLS 查詢年假餘額...');
      
      let query = supabase
        .from('annual_leave_balance')
        .select('*')
        .order('year', { ascending: false });

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ 查詢年假餘額失敗:', error);
        return { data: [], error };
      }

      console.log('✅ 年假餘額查詢成功 (優化後):', data?.length || 0, '筆');
      return { data: data || [], error: null };
      
    } catch (error) {
      console.error('❌ 年假餘額查詢時發生錯誤:', error);
      return { data: [], error };
    }
  }, []);

  // 手動觸發權限緩存刷新
  const triggerCacheRefresh = useCallback(async () => {
    const success = await refreshPermissionsCache();
    if (success) {
      console.log('🎯 權限緩存刷新完成，建議重新載入相關資料');
    }
    return success;
  }, [refreshPermissionsCache]);

  return {
    userContext,
    getStaffData,
    getLeaveRequests,
    getAnnualLeaveBalance,
    triggerCacheRefresh
  };
};
