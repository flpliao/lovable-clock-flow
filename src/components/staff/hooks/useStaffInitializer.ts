
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStaffInitializer = () => {
  const { toast } = useToast();

  const initializeLiaoJunxiongStaff = async () => {
    try {
      console.log('檢查廖俊雄員工記錄是否存在...');
      
      // 檢查是否已經存在廖俊雄的記錄
      const { data: existingStaff, error: checkError } = await supabase
        .from('staff')
        .select('*')
        .eq('id', '550e8400-e29b-41d4-a716-446655440001')
        .maybeSingle();

      if (checkError) {
        console.error('檢查員工記錄錯誤:', checkError);
        return;
      }

      if (existingStaff) {
        console.log('廖俊雄員工記錄已存在:', existingStaff);
        return;
      }

      console.log('廖俊雄員工記錄不存在，但應該在資料庫中已建立');
    } catch (error) {
      console.error('初始化廖俊雄員工記錄失敗:', error);
    }
  };

  // 組件掛載時執行初始化檢查
  useEffect(() => {
    initializeLiaoJunxiongStaff();
  }, []);

  return { initializeLiaoJunxiongStaff };
};
