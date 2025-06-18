
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export class DepartmentDeleteService {
  static async deleteDepartment(id: string): Promise<boolean> {
    try {
      console.log('🗑️ 刪除部門:', id);
      
      // 檢查是否有員工屬於此部門
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('department', id);

      if (staffError) {
        console.error('❌ 檢查員工資料錯誤:', staffError);
        throw staffError;
      }

      if (staffData && staffData.length > 0) {
        toast({
          title: "無法刪除",
          description: "此部門下仍有員工，請先移除所有員工後再刪除部門",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ 刪除部門錯誤:', error);
        throw error;
      }

      console.log('✅ 成功刪除部門');
      
      toast({
        title: "刪除成功",
        description: "部門已成功刪除",
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 刪除部門失敗:', error);
      
      let errorMessage = "無法從資料庫刪除部門";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "刪除失敗",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }
}
