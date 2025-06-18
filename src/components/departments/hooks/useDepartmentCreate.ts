
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
      console.error('💥 新增部門完整錯誤資訊:', error);
      
      let errorMessage = "無法新增部門，請檢查資料後重試";
      
      if (error.message) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          errorMessage = "系統權限設定問題，請聯繫管理員";
        } else if (error.message.includes('violates') || error.message.includes('constraint')) {
          errorMessage = "資料格式錯誤或違反約束條件";
        } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = "部門名稱已存在，請使用不同的名稱";
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
