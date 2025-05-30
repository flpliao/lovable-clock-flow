
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStaffInitializer = () => {
  const { toast } = useToast();

  const initializeLiaoJunxiongStaff = async () => {
    try {
      console.log('檢查廖俊雄員工記錄...');
      
      // 直接檢查廖俊雄的記錄是否存在
      const { data: existingStaff, error: checkError } = await supabase
        .from('staff')
        .select('*')
        .eq('id', '550e8400-e29b-41d4-a716-446655440001')
        .maybeSingle();

      if (checkError) {
        console.error('檢查員工記錄錯誤:', checkError);
        return null;
      }

      if (existingStaff) {
        console.log('✅ 廖俊雄員工記錄已存在:', existingStaff);
        console.log('✅ 確認身份：');
        console.log('   - 姓名:', existingStaff.name);
        console.log('   - 角色:', existingStaff.role);
        console.log('   - 職位:', existingStaff.position);
        console.log('   - 部門:', existingStaff.department);
        console.log('   - 管理者權限:', existingStaff.role === 'admin' ? '是' : '否');
        
        if (existingStaff.role === 'admin') {
          console.log('🔑 廖俊雄具有系統管理者權限');
        } else {
          console.warn('⚠️ 廖俊雄不是系統管理者，當前角色:', existingStaff.role);
        }
        
        return existingStaff;
      }

      console.log('❌ 廖俊雄員工記錄不存在於資料庫中');
      return null;
    } catch (error) {
      console.error('初始化廖俊雄員工記錄失敗:', error);
      return null;
    }
  };

  // 驗證管理者權限
  const verifyAdminAccess = async () => {
    const staff = await initializeLiaoJunxiongStaff();
    if (staff && staff.role === 'admin') {
      toast({
        title: "管理者確認",
        description: `${staff.name} 已確認為系統管理者`,
        variant: "default"
      });
    } else if (staff) {
      toast({
        title: "權限警告",
        description: `${staff.name} 不是系統管理者`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "錯誤",
        description: "無法找到廖俊雄的員工記錄",
        variant: "destructive"
      });
    }
  };

  // 組件掛載時執行初始化檢查
  useEffect(() => {
    initializeLiaoJunxiongStaff();
  }, []);

  return { 
    initializeLiaoJunxiongStaff,
    verifyAdminAccess
  };
};
