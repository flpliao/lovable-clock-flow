
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NewDepartment } from '../types';

export const useDepartmentCreate = () => {
  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    try {
      console.log('🚀 開始新增部門:', newDepartment);
      
      // 檢查當前用戶身份
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('👤 當前用戶:', user?.id);
      
      if (authError) {
        console.error('❌ 身份驗證錯誤:', authError);
      }

      // 準備要插入的資料
      const departmentData = {
        name: newDepartment.name.trim(),
        type: newDepartment.type,
        location: newDepartment.location?.trim() || null,
        manager_name: newDepartment.manager_name?.trim() || null,
        manager_contact: newDepartment.manager_contact?.trim() || null,
        staff_count: 0
      };

      console.log('📝 準備插入的部門資料:', departmentData);

      const { data, error } = await supabase
        .from('departments')
        .insert([departmentData])
        .select();

      if (error) {
        console.error('❌ 新增部門資料庫錯誤:', error);
        console.error('錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ 成功新增部門:', data);
      toast({
        title: "新增成功",
        description: `部門 "${newDepartment.name}" 已成功新增`,
      });
      return true;
    } catch (error: any) {
      console.error('💥 新增部門完整錯誤資訊:', error);
      
      let errorMessage = "無法新增部門，請檢查資料後重試";
      
      if (error.message) {
        if (error.message.includes('row-level security')) {
          errorMessage = "權限不足，無法新增部門";
        } else if (error.message.includes('violates')) {
          errorMessage = "資料格式錯誤或違反約束條件";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "新增失敗",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  return { addDepartment };
};
