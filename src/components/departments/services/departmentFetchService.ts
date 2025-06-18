
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';
import { toast } from '@/hooks/use-toast';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔍 開始從 Supabase 載入部門資料...');
      
      // 確保廖俊雄管理員權限
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 當前認證用戶:', user?.id);
      
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
        
        // 如果是權限問題，顯示具體錯誤
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          console.log('🔒 檢測到 RLS 權限問題');
          toast({
            title: "權限問題",
            description: "廖俊雄管理員無法存取部門資料，請檢查資料庫權限設定",
            variant: "destructive",
          });
          return [];
        }
        
        throw error;
      }

      console.log('✅ 成功載入部門資料:', data?.length || 0, '個部門');
      console.log('📋 部門資料內容:', data);
      
      // 轉換資料格式以符合前端介面
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as 'headquarters' | 'branch' | 'store',
        location: item.location || '',
        manager_name: item.manager_name || '',
        manager_contact: item.manager_contact || '',
        staff_count: item.staff_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log('🔄 轉換後的部門資料:', transformedData);
      return transformedData;
      
    } catch (error) {
      console.error('💥 載入部門資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法從後台資料庫載入部門資料",
        variant: "destructive",
      });
      return [];
    }
  }
}
