
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔍 廖俊雄管理員從 Supabase 載入部門資料...');
      console.log('🔐 使用特殊 RLS 政策 - 無權限限制');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入部門資料錯誤:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        console.log('🔒 廖俊雄管理員 RLS 政策應已解決權限問題');
        return [];
      }

      console.log('✅ 廖俊雄管理員成功載入部門資料:', data?.length || 0, '個部門');
      console.log('📋 部門資料內容:', data);
      
      // 轉換資料格式以符合前端介面
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

      console.log('🔄 轉換後的部門資料:', transformedData);
      
      // 移除 toast 提醒以避免干擾
      console.log(`部門資料載入完成 - 共 ${transformedData.length} 個部門`);
      
      return transformedData;
      
    } catch (error) {
      console.error('💥 載入部門資料系統錯誤:', error);
      return [];
    }
  }
}
