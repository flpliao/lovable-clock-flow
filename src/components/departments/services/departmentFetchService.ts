
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔄 正在同步後台部門資料到前台...');
      console.log('🔍 特別檢查部門 ID: 56727091-50b7-4ef4-93f7-c3d09c91d537');
      
      // 強制清除任何可能的快取，直接查詢最新資料
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 部門資料同步失敗:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        console.log('⚠️ 檢查後台連線狀態和RLS政策設定');
        return [];
      }

      console.log('📥 從後台獲取的原始資料:', data);
      console.log('✅ 後台部門資料載入成功，部門數量:', data?.length || 0);
      
      // 檢查是否包含目標部門
      const targetDepartment = data?.find(item => item.id === '56727091-50b7-4ef4-93f7-c3d09c91d537');
      if (targetDepartment) {
        console.log('🎯 找到目標部門資料:', targetDepartment);
      } else {
        console.log('⚠️ 目標部門未在查詢結果中，所有部門 ID:');
        data?.forEach((dept, index) => {
          console.log(`  ${index + 1}. ${dept.id} - ${dept.name}`);
        });
      }
      
      // 轉換資料格式以符合前台介面
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as 'headquarters' | 'branch' | 'store' | 'department',
        location: item.location || '',
        manager_name: item.manager_name || '',
        manager_contact: item.manager_contact || '',
        staff_count: item.staff_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log('🔄 部門資料前後台同步完成，前台可用部門:', transformedData.length, '個');
      
      // 再次檢查轉換後的資料
      const transformedTargetDepartment = transformedData.find(dept => dept.id === '56727091-50b7-4ef4-93f7-c3d09c91d537');
      if (transformedTargetDepartment) {
        console.log('✅ 目標部門已轉換:', transformedTargetDepartment);
      } else {
        console.log('❌ 目標部門在轉換過程中遺失');
      }
      
      return transformedData;
      
    } catch (error) {
      console.error('💥 部門資料前後台同步系統錯誤:', error);
      return [];
    }
  }
}
