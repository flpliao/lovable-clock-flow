
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Department, NewDepartment } from '../types';
import { transformDepartmentData, transformToDbFormat } from '../services/departmentTransformService';

interface DepartmentOperationsReturn {
  loading: boolean;
  departments: Department[];
  fetchDepartments: () => Promise<Department[]>;
  refreshDepartments: () => Promise<void>;
  addDepartment: (newDepartment: NewDepartment) => Promise<boolean>;
  updateDepartment: (department: Department) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;
  updateStaffCount: (departmentId: string) => Promise<void>;
}

export const useSupabaseDepartmentOperations = (): DepartmentOperationsReturn => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      console.log('開始從 Supabase 載入部門資料...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('載入部門資料錯誤:', error);
        throw error;
      }

      console.log('成功載入部門資料:', data);
      const transformedData = data ? data.map(transformDepartmentData) : [];
      setDepartments(transformedData);
      return transformedData;
    } catch (error) {
      console.error('載入部門資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入部門資料，請稍後再試",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshDepartments = async () => {
    await fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async (newDepartment: NewDepartment) => {
    try {
      setLoading(true);
      console.log('新增部門:', newDepartment);

      const dbData = transformToDbFormat(newDepartment);
      
      const { data, error } = await supabase
        .from('departments')
        .insert([dbData])
        .select();

      if (error) {
        console.error('新增部門錯誤:', error);
        throw error;
      }

      console.log('成功新增部門:', data);
      await refreshDepartments();
      toast({
        title: "新增成功",
        description: `部門 "${newDepartment.name}" 已成功新增`,
      });
      return true;
    } catch (error) {
      console.error('新增部門失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增部門，請檢查資料後重試",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (department: Department) => {
    try {
      setLoading(true);
      console.log('更新部門:', department);

      const { data, error } = await supabase
        .from('departments')
        .update({
          name: department.name,
          type: department.type,
          location: department.location,
          manager_name: department.manager_name,
          manager_contact: department.manager_contact,
          updated_at: new Date().toISOString()
        })
        .eq('id', department.id)
        .select();

      if (error) {
        console.error('更新部門錯誤:', error);
        throw error;
      }

      console.log('成功更新部門:', data);
      await refreshDepartments();
      toast({
        title: "更新成功",
        description: `部門 "${department.name}" 已成功更新`,
      });
      return true;
    } catch (error) {
      console.error('更新部門失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新部門，請稍後再試",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      setLoading(true);
      console.log('刪除部門 ID:', id);

      // 檢查是否有員工屬於此部門
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('department_id', id);

      if (staffError) {
        console.error('檢查員工資料錯誤:', staffError);
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
        console.error('刪除部門錯誤:', error);
        throw error;
      }

      console.log('成功刪除部門');
      toast({
        title: "刪除成功",
        description: "部門已成功刪除",
      });
      return true;
    } catch (error) {
      console.error('刪除部門失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除部門，請稍後再試",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffCount = async (departmentId: string) => {
    try {
      console.log('更新部門員工數量:', departmentId);
      
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('department_id', departmentId);

      if (staffError) {
        console.error('計算員工數量錯誤:', staffError);
        return;
      }

      const staffCount = staffData ? staffData.length : 0;
      
      const { error: updateError } = await supabase
        .from('departments')
        .update({ 
          staff_count: staffCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', departmentId);

      if (updateError) {
        console.error('更新員工數量錯誤:', updateError);
      } else {
        console.log(`部門 ${departmentId} 員工數量已更新為: ${staffCount}`);
      }
    } catch (error) {
      console.error('更新員工數量失敗:', error);
    }
  };

  return {
    loading,
    departments,
    fetchDepartments,
    refreshDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    updateStaffCount
  };
};
