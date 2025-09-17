import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment as updateDepartmentService,
} from '@/services/departmentService';
import { useDepartmentStore } from '@/stores/departmentStore';
import { Department } from '@/types/department';
import { showError } from '@/utils/toast';
import { useState } from 'react';

export const useDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { departments, setDepartments, addDepartment, updateDepartment, removeDepartment } =
    useDepartmentStore();

  // 載入所有單位
  const loadDepartments = async () => {
    if (departments.length > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 創建新單位
  const handleCreateDepartment = async (
    departmentData: Omit<Department, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ): Promise<Department> => {
    setIsLoading(true);
    try {
      const newDepartment = await createDepartment(departmentData);
      addDepartment(newDepartment);
      return newDepartment;
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新單位
  const handleUpdateDepartment = async (
    slug: string,
    departmentData: Partial<Department>
  ): Promise<Department | null> => {
    setIsLoading(true);
    try {
      const updatedDepartment = await updateDepartmentService(slug, departmentData);
      updateDepartment(updatedDepartment.slug, updatedDepartment);
      return updatedDepartment;
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除單位
  const handleDeleteDepartment = async (slug: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await deleteDepartment(slug);
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
