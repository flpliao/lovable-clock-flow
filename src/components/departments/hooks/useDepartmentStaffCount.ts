
import { supabase } from '@/integrations/supabase/client';

export const useDepartmentStaffCount = () => {
  const updateStaffCount = async (departmentId: string): Promise<void> => {
    try {
      console.log('更新部門員工數量:', departmentId);
      
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('department', departmentId);

      if (staffError) {
        console.error('計算員工數量錯誤:', staffError);
        return;
      }

      const staffCount = staffData ? staffData.length : 0;
      
      const { error: updateError } = await supabase
        .from('departments')
        .update({ 
          staff_count: staffCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', departmentId);

      if (updateError) {
        console.error('更新員工數量錯誤:', updateError);
      } else {
        console.log(`部門 ${departmentId} 員工數量已更新為: ${staffCount}`);
      }
    } catch (error) {
      console.error('更新員工數量失敗:', error);
    }
  };

  return { updateStaffCount };
};
