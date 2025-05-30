
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Department, NewDepartment } from '../types';
import { departmentApiService } from '../services/departmentApiService';

export const useSupabaseDepartmentOperations = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 從 Supabase 載入部門資料
  const loadDepartments = async () => {
    try {
      console.log('🔄 正在從 Supabase 載入部門資料...');
      setLoading(true);
      const data = await departmentApiService.loadDepartments();
      console.log('✅ 成功載入部門資料:', data);
      setDepartments(data);
      
      if (data && data.length > 0) {
        toast({
          title: "載入成功",
          description: `已載入 ${data.length} 個部門/門市`,
        });
      }
    } catch (error) {
      console.error('❌ 載入部門資料發生錯誤:', error);
      toast({
        title: "載入錯誤",
        description: "載入部門資料時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 新增部門
  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增部門/門市",
        variant: "destructive"
      });
      return false;
    }

    try {
      const transformedData = await departmentApiService.addDepartment(newDepartment);
      setDepartments(prev => [...prev, transformedData]);
      
      toast({
        title: "新增成功",
        description: `已成功新增 ${transformedData.name} 至部門/門市列表`
      });
      
      // 重新載入確保同步
      await loadDepartments();
      
      return true;
    } catch (error) {
      console.error('新增部門發生錯誤:', error);
      toast({
        title: "新增失敗",
        description: error instanceof Error ? error.message : "新增部門時發生錯誤",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新部門
  const updateDepartment = async (department: Department): Promise<boolean> => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯部門/門市",
        variant: "destructive"
      });
      return false;
    }

    try {
      const transformedData = await departmentApiService.updateDepartment(department);
      setDepartments(prev => prev.map(dept => 
        dept.id === department.id ? transformedData : dept
      ));
      
      toast({
        title: "更新成功",
        description: `已成功更新 ${transformedData.name} 的資料`
      });
      
      // 重新載入確保同步
      await loadDepartments();
      
      return true;
    } catch (error) {
      console.error('更新部門發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "更新部門時發生錯誤",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除部門
  const deleteDepartment = async (id: string): Promise<boolean> => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除部門/門市",
        variant: "destructive"
      });
      return false;
    }

    try {
      // 檢查部門是否有員工
      const deptToDelete = departments.find(dept => dept.id === id);
      if (deptToDelete && deptToDelete.staffCount > 0) {
        toast({
          title: "無法刪除",
          description: `${deptToDelete.name} 中還有 ${deptToDelete.staffCount} 名員工，請先將員工移至其他部門`,
          variant: "destructive"
        });
        return false;
      }

      await departmentApiService.deleteDepartment(id);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      
      toast({
        title: "刪除成功",
        description: "已成功從列表中移除該部門/門市"
      });
      
      // 重新載入確保同步
      await loadDepartments();
      
      return true;
    } catch (error) {
      console.error('刪除部門發生錯誤:', error);
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "刪除部門時發生錯誤",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刷新資料
  const refreshDepartments = async () => {
    console.log('🔄 手動刷新部門資料...');
    await loadDepartments();
  };

  // 組件載入時自動載入資料
  useEffect(() => {
    console.log('📋 DepartmentOperations: 初始化載入部門資料...');
    loadDepartments();
  }, []);

  return {
    departments,
    loading,
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refreshDepartments
  };
};
