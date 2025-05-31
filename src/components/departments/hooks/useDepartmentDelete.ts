
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDepartmentDelete = () => {
  const { toast } = useToast();
  
  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      console.log('刪除部門 ID:', id);

      // 檢查是否有員工屬於此部門
      const staffQuery = supabase
        .from('staff')
        .select('id')
        .eq('department_id', id);
      
      const staffResponse = await staffQuery;

      if (staffResponse.error) {
        console.error('檢查員工資料錯誤:', staffResponse.error);
        throw staffResponse.error;
      }

      if (staffResponse.data && staffResponse.data.length > 0) {
        toast({
          title: "無法刪除",
          description: "此部門下仍有員工，請先移除所有員工後再刪除部門",
          variant: "destructive",
        });
        return false;
      }

      const deleteQuery = supabase
        .from('departments')
        .delete()
        .eq('id', id);
        
      const deleteResponse = await deleteQuery;

      if (deleteResponse.error) {
        console.error('刪除部門錯誤:', deleteResponse.error);
        throw deleteResponse.error;
      }

      console.log('成功刪除部門');
      toast({
        title: "刪除成功",
        description: "部門已成功刪除",
      });
      return true;
    } catch (error) {
      console.error('刪除部門失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除部門，請稍後再試",
        variant: "destructive",
      });
      return false;
    }
  };

  return { deleteDepartment };
};
