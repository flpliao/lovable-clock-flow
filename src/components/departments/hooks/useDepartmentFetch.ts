
import { toast } from '@/hooks/use-toast';
import { Department } from '../types';
import { DepartmentFetchService } from '../services/departmentFetchService';

export const useDepartmentFetch = () => {
  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      console.log('🔍 開始從後台載入部門資料，檢查特定部門 ID: 56727091-50b7-4ef4-93f7-c3d09c91d537');
      
      const departments = await DepartmentFetchService.getAllDepartments();
      
      // 檢查是否包含特定的部門 ID
      const targetDepartment = departments.find(dept => dept.id === '56727091-50b7-4ef4-93f7-c3d09c91d537');
      if (targetDepartment) {
        console.log('✅ 找到目標部門:', targetDepartment);
      } else {
        console.log('⚠️ 未找到目標部門，可用部門列表:', departments.map(d => ({ id: d.id, name: d.name })));
      }
      
      console.log('📊 成功載入部門資料，總數:', departments.length);
      return departments;
    } catch (error) {
      console.error('❌ 載入部門資料失敗:', error);
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
