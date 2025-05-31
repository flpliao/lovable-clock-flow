
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useDepartmentUpdate = () => {
  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      console.log('🔄 開始更新部門到資料庫:', department);

      // 驗證必填欄位
      if (!department.name.trim()) {
        throw new Error('部門名稱不能為空');
      }

      if (!department.type) {
        throw new Error('部門類型不能為空');
      }

      const updateData = {
        name: department.name.trim(),
        type: department.type,
        location: department.location?.trim() || null,
        manager_name: department.manager_name?.trim() || null,
        manager_contact: department.manager_contact?.trim() || null,
        staff_count: department.staff_count || 0,
        updated_at: new Date().toISOString()
      };

      console.log('📝 準備更新的資料:', updateData);

      const { data, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', department.id)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新部門錯誤:', error);
        throw error;
      }

      console.log('✅ 成功更新部門:', data);
      
      toast({
        title: "更新成功",
        description: `部門 "${data.name}" 已成功更新`,
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 更新部門失敗:', error);
      
      let errorMessage = "無法更新部門，請稍後再試";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "更新失敗",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return { updateDepartment };
};
