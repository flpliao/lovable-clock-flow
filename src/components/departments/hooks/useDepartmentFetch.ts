
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { transformDepartmentData } from '../services/departmentTransformService';

export const useDepartmentFetch = () => {
  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      console.log('開始從 Supabase 載入部門資料...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('載入部門資料錯誤:', error);
        throw error;
      }

      console.log('成功載入部門資料:', data);
      return data ? data.map(transformDepartmentData) : [];
    } catch (error) {
      console.error('載入部門資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入部門資料，請稍後再試",
        variant: "destructive",
      });
      return [];
    }
  };

  return { fetchDepartments };
};
