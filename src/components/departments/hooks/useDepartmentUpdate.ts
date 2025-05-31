
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';

export const useDepartmentUpdate = () => {
  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      console.log('更新部門:', department);

      const { data, error } = await supabase
        .from('departments')
        .update({
          name: department.name,
          type: department.type,
          location: department.location,
          manager_name: department.manager_name,
          manager_contact: department.manager_contact,
          updated_at: new Date().toISOString()
        })
        .eq('id', department.id)
        .select();

      if (error) {
        console.error('更新部門錯誤:', error);
        throw error;
      }

      console.log('成功更新部門:', data);
      toast({
        title: "更新成功",
        description: `部門 "${department.name}" 已成功更新`,
      });
      return true;
    } catch (error) {
      console.error('更新部門失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新部門，請稍後再試",
        variant: "destructive",
      });
      return false;
    }
  };

  return { updateDepartment };
};
