
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Department, NewDepartment } from '../types';

export const useSupabaseDepartmentOperations = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 從 Supabase 載入部門資料
  const loadDepartments = async () => {
    try {
      setLoading(true);
      console.log('正在從 Supabase 載入部門資料...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('載入部門資料失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入部門資料，請稍後再試",
          variant: "destructive"
        });
        return;
      }

      console.log('成功載入部門資料:', data);
      setDepartments(data || []);
      
    } catch (error) {
      console.error('載入部門資料發生錯誤:', error);
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
      console.log('正在新增部門:', newDepartment);
      
      const { data, error } = await supabase
        .from('departments')
        .insert([newDepartment])
        .select()
        .single();

      if (error) {
        console.error('新增部門失敗:', error);
        toast({
          title: "新增失敗",
          description: error.message || "新增部門時發生錯誤",
          variant: "destructive"
        });
        return false;
      }

      console.log('成功新增部門:', data);
      setDepartments(prev => [...prev, data]);
      
      toast({
        title: "新增成功",
        description: `已成功新增 ${data.name} 至部門/門市列表`
      });
      
      return true;
    } catch (error) {
      console.error('新增部門發生錯誤:', error);
      toast({
        title: "新增錯誤",
        description: "新增部門時發生錯誤",
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
      console.log('正在更新部門:', department);
      
      const { data, error } = await supabase
        .from('departments')
        .update({
          name: department.name,
          type: department.type,
          location: department.location,
          manager_name: department.managerName,
          manager_contact: department.managerContact,
          staff_count: department.staffCount
        })
        .eq('id', department.id)
        .select()
        .single();

      if (error) {
        console.error('更新部門失敗:', error);
        toast({
          title: "更新失敗",
          description: error.message || "更新部門時發生錯誤",
          variant: "destructive"
        });
        return false;
      }

      console.log('成功更新部門:', data);
      setDepartments(prev => prev.map(dept => 
        dept.id === department.id ? { ...data, managerName: data.manager_name, managerContact: data.manager_contact } : dept
      ));
      
      toast({
        title: "更新成功",
        description: `已成功更新 ${data.name} 的資料`
      });
      
      return true;
    } catch (error) {
      console.error('更新部門發生錯誤:', error);
      toast({
        title: "更新錯誤",
        description: "更新部門時發生錯誤",
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
      console.log('正在刪除部門:', id);
      
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

      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('刪除部門失敗:', error);
        toast({
          title: "刪除失敗",
          description: error.message || "刪除部門時發生錯誤",
          variant: "destructive"
        });
        return false;
      }

      console.log('成功刪除部門:', id);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      
      toast({
        title: "刪除成功",
        description: "已成功從列表中移除該部門/門市"
      });
      
      return true;
    } catch (error) {
      console.error('刪除部門發生錯誤:', error);
      toast({
        title: "刪除錯誤",
        description: "刪除部門時發生錯誤",
        variant: "destructive"
      });
      return false;
    }
  };

  // 組件載入時自動載入資料
  useEffect(() => {
    loadDepartments();
  }, []);

  return {
    departments,
    loading,
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
