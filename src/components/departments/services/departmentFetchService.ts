
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';
import { toast } from '@/hooks/use-toast';

export class DepartmentFetchService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔍 從 Supabase 載入所有部門...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入部門錯誤:', error);
        throw error;
      }

      console.log('✅ 成功載入部門:', data?.length, '個');
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
