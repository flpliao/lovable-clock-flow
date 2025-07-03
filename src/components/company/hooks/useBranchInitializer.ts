import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useBranchInitializer = () => {
  const currentUser = useCurrentUser();

  const initializeDefaultBranch = async () => {
    try {
      console.log('檢查預設營業處是否存在...');
      
      // 檢查是否已經存在預設總公司
      const { data: existingBranch, error: checkError } = await supabase
        .from('branches')
        .select('*')
        .eq('id', '1')
        .maybeSingle();

      if (checkError) {
        console.error('檢查營業處錯誤:', checkError);
        return;
      }

      if (existingBranch) {
        console.log('預設營業處已存在:', existingBranch);
        return;
      }

      // 如果不存在，則新增預設總公司
      console.log('新增預設總公司營業處...');
      
      const branchData = {
        id: '1',
        company_id: '1', // 假設有預設公司 ID
        code: 'HQ001',
        name: '總公司',
        type: 'headquarters',
        address: '台北市信義區',
        phone: '02-1234-5678',
        email: 'headquarters@company.com',
        manager_name: '廖俊雄',
        manager_contact: '0900-000-000',
        staff_count: 1,
        is_active: true
      };

      const { data, error } = await supabase
        .from('branches')
        .insert(branchData)
        .select()
        .single();

      if (error) {
        console.error('新增預設營業處失敗:', error);
        if (error.message.includes('duplicate key')) {
          console.log('營業處已存在，跳過新增');
          return;
        }
        throw error;
      }

      console.log('成功新增預設營業處:', data);
    } catch (error) {
      console.error('初始化預設營業處失敗:', error);
      // 靜默處理錯誤
    }
  };

  // 移除依賴條件，始終嘗試初始化
  useEffect(() => {
    initializeDefaultBranch();
  }, []); // 只在組件掛載時執行一次

  return { initializeDefaultBranch };
};
