
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { DepartmentService } from '../services/departmentService';

export const useDepartmentUpdate = () => {
  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      console.log('🔄 開始更新部門到資料庫:', department);

      const result = await DepartmentService.updateDepartment(department);
      return result !== null;
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
