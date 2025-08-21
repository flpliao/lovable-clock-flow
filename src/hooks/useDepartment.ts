import { DepartmentService } from '@/services/departmentService';
import { useDepartmentStore } from '@/stores/departmentStore';
import { Department } from '@/types/department';
import { showError } from '@/utils/toast';
import { useState } from 'react';

export const useDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { departments, setDepartments, addDepartment, updateDepartment, removeDepartment } =
    useDepartmentStore();

  // 載入所有部門
  const loadDepartments = async () => {
    if (departments.length > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const data = await DepartmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 創建新部門
  const handleCreateDepartment = async (
    departmentData: Omit<Department, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ): Promise<Department> => {
    setIsLoading(true);
    try {
      const newDepartment = await DepartmentService.createDepartment(departmentData);
      addDepartment(newDepartment);
      return newDepartment;
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新部門
  const handleUpdateDepartment = async (
    slug: string,
    departmentData: Partial<Department>
  ): Promise<Department | null> => {
    setIsLoading(true);
    try {
      const updatedDepartment = await DepartmentService.updateDepartment(slug, departmentData);
      updateDepartment(updatedDepartment.slug, updatedDepartment);
      return updatedDepartment;
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除部門
  const handleDeleteDepartment = async (slug: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await DepartmentService.deleteDepartment(slug);
      removeDepartment(slug);

      return true;
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 狀態
    departments,
    isLoading,

    // 操作方法
    loadDepartments,
    handleCreateDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
  };
};
