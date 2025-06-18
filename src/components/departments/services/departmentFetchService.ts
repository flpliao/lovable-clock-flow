
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔄 正在同步後台部門資料到前台...');
      
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

      console.log('✅ 後台部門資料載入成功，部門數量:', data?.length || 0);
      console.log('📊 後台部門資料內容:', data);
      
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
      
      return transformedData;
      
    } catch (error) {
      console.error('💥 部門資料前後台同步系統錯誤:', error);
      return [];
    }
  }
}
