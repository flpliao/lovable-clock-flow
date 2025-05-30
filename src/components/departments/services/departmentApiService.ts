
import { supabase } from '@/integrations/supabase/client';
import { Department, NewDepartment } from '../types';
import { transformDepartmentData, transformToDbFormat } from './departmentTransformService';

export const departmentApiService = {
  // 從 Supabase 載入部門資料
  async loadDepartments(): Promise<Department[]> {
    console.log('正在從 Supabase 載入部門資料...');
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('載入部門資料失敗:', error);
      throw new Error(error.message || '載入部門資料失敗');
    }

    console.log('成功載入部門資料:', data);
    return data?.map(transformDepartmentData) || [];
  },

  // 新增部門
  async addDepartment(newDepartment: NewDepartment): Promise<Department> {
    console.log('正在新增部門:', newDepartment);
    
    const dbData = transformToDbFormat(newDepartment);
    
    const { data, error } = await supabase
      .from('departments')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('新增部門失敗:', error);
      throw new Error(error.message || '新增部門時發生錯誤');
    }

    console.log('成功新增部門:', data);
    return transformDepartmentData(data);
  },

  // 更新部門
  async updateDepartment(department: Department): Promise<Department> {
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
      throw new Error(error.message || '更新部門時發生錯誤');
    }

    console.log('成功更新部門:', data);
    return transformDepartmentData(data);
  },

  // 刪除部門
  async deleteDepartment(id: string): Promise<void> {
    console.log('正在刪除部門:', id);
    
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('刪除部門失敗:', error);
      throw new Error(error.message || '刪除部門時發生錯誤');
    }

    console.log('成功刪除部門:', id);
  }
};
