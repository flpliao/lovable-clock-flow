
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NewDepartment } from '../types';

export const useDepartmentCreate = () => {
  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    try {
      console.log('新增部門:', newDepartment);

      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: newDepartment.name.trim(),
          type: newDepartment.type,
          location: newDepartment.location?.trim() || null,
          manager_name: newDepartment.manager_name?.trim() || null,
          manager_contact: newDepartment.manager_contact?.trim() || null,
          staff_count: 0
        }])
        .select();

      if (error) {
        console.error('新增部門錯誤:', error);
        throw error;
      }

      console.log('成功新增部門:', data);
      toast({
        title: "新增成功",
        description: `部門 "${newDepartment.name}" 已成功新增`,
      });
      return true;
    } catch (error) {
      console.error('新增部門失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增部門，請檢查資料後重試",
        variant: "destructive",
      });
      return false;
    }
  };

  return { addDepartment };
};
