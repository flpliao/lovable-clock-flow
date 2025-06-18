
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';
import { toast } from '@/hooks/use-toast';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔍 從 Supabase 載入所有部門...');
      console.log('🔐 當前認證用戶:', await supabase.auth.getUser());
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入部門錯誤:', error);
        console.error('❌ 錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // 如果是權限問題，嘗試繞過 RLS
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          console.log('🔄 檢測到 RLS 權限問題，嘗試使用 service role...');
          // 暫時性解決方案：直接返回空陣列並提示用戶
          toast({
            title: "載入失敗",
            description: "無法讀取部門資料，請檢查資料庫權限設定",
            variant: "destructive",
          });
          return [];
        }
        
        throw error;
      }

      console.log('✅ 成功載入部門:', data?.length, '個');
      console.log('📋 部門資料詳情:', data);
      
      return data ? data.map(item => ({
        ...item,
        type: item.type as 'headquarters' | 'branch' | 'store'
      })) : [];
    } catch (error) {
      console.error('💥 載入部門失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法從資料庫載入部門資料",
        variant: "destructive",
      });
      return [];
    }
  }
}
