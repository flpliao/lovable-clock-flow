
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { DepartmentService } from '../services/departmentService';

export const useDepartmentFetch = () => {
  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      console.log('開始從 Supabase 載入部門資料...');
      
      const departments = await DepartmentService.getAllDepartments();
      console.log('成功載入部門資料:', departments);
      return departments;
    } catch (error) {
      console.error('載入部門資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入部門資料，請稍後再試",
        variant: "destructive",
      });
      return [];
    }
  };

  return { fetchDepartments };
};
