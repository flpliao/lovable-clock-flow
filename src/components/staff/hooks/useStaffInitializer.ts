
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export const useStaffInitializer = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();

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

      // 如果不存在，則新增廖俊雄的員工記錄
      console.log('新增廖俊雄員工記錄...');
      
      const staffData = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: '廖俊雄',
        position: '資深工程師',
        department: '資訊部',
        branch_id: '1', // 預設總公司
        branch_name: '總公司',
        contact: '0900-000-000',
        role: 'admin',
        role_id: 'admin',
        supervisor_id: null, // 最高管理者沒有上級
        username: 'liao_junxiong',
        email: 'liao.junxiong@company.com'
      };

      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) {
        console.error('新增廖俊雄員工記錄失敗:', error);
        if (error.message.includes('duplicate key')) {
          console.log('員工記錄已存在，跳過新增');
          return;
        }
        throw error;
      }

      console.log('成功新增廖俊雄員工記錄:', data);
      toast({
        title: "系統初始化完成",
        description: "已成功新增廖俊雄管理員帳戶"
      });
    } catch (error) {
      console.error('初始化廖俊雄員工記錄失敗:', error);
      // 靜默處理錯誤，避免影響系統正常運作
    }
  };

  // 移除依賴條件，始終嘗試初始化
  useEffect(() => {
    initializeLiaoJunxiongStaff();
  }, []); // 只在組件掛載時執行一次

  return { initializeLiaoJunxiongStaff };
};
