
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { DepartmentApiService } from '../services/departmentApiService';

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

      console.log('📝 呼叫 API 服務更新部門...');
      const updatedDepartment = await DepartmentApiService.updateDepartment(department);

      if (!updatedDepartment) {
        throw new Error('API 服務更新失敗');
      }

      console.log('✅ API 服務更新成功:', updatedDepartment);
      
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
