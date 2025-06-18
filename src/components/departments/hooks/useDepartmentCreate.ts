
import { toast } from '@/hooks/use-toast';
import { NewDepartment } from '../types';
import { DepartmentService } from '../services/departmentService';

export const useDepartmentCreate = () => {
  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    try {
      console.log('🚀 開始新增部門:', newDepartment);
      
      const result = await DepartmentService.createDepartment(newDepartment);
      return result !== null;
    } catch (error: any) {
      console.error('💥 新增部門錯誤:', error);
      
      // 讓 service 層處理錯誤訊息，這裡只做基本的錯誤處理
      if (!error.message || !error.message.includes('新增失敗')) {
        toast({
          title: "新增失敗",
          description: "系統發生錯誤，請稍後再試",
          variant: "destructive",
        });
      }
      
      return false;
    }
  };

  return { addDepartment };
};
