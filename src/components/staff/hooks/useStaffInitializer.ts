
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStaffInitializer = () => {
  const { toast } = useToast();

  const initializeLiaoJunxiongStaff = async () => {
    try {
      console.log('檢查廖俊雄員工記錄...');
      
      // 使用 RPC 函數來安全地檢查用戶角色
      const { data: userRole, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_uuid: '550e8400-e29b-41d4-a716-446655440001' });

      if (roleError) {
        console.error('檢查用戶角色錯誤:', roleError);
        return null;
      }

      if (userRole) {
        console.log('✅ 廖俊雄員工記錄存在，角色:', userRole);
        
        // 如果需要獲取完整員工資訊，使用直接查詢（僅限特定 ID）
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('id', '550e8400-e29b-41d4-a716-446655440001')
          .single();

        if (staffError) {
          console.error('獲取員工詳細資訊錯誤:', staffError);
          // 即使無法獲取詳細資訊，也返回基本角色資訊
          return {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: '廖俊雄',
            role: userRole
          };
        }

        console.log('✅ 確認身份：');
        console.log('   - 姓名:', staffData.name);
        console.log('   - 角色:', staffData.role);
        console.log('   - 職位:', staffData.position);
        console.log('   - 部門:', staffData.department);
        console.log('   - 管理者權限:', staffData.role === 'admin' ? '是' : '否');
        
        if (staffData.role === 'admin') {
          console.log('🔑 廖俊雄具有系統管理者權限');
        } else {
          console.warn('⚠️ 廖俊雄不是系統管理者，當前角色:', staffData.role);
        }
        
        return staffData;
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
