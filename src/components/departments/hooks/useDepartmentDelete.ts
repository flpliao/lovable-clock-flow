
import { toast } from '@/hooks/use-toast';
import { DepartmentService } from '../services/departmentService';

export const useDepartmentDelete = () => {
  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      console.log('刪除部門 ID:', id);

      return await DepartmentService.deleteDepartment(id);
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
