import {
  createDepartment as createDepartmentService,
  deleteDepartment as deleteDepartmentService,
  getAllDepartments,
  updateDepartment as updateDepartmentService,
} from '@/services/departmentService';
import { useDepartmentStore } from '@/stores/departmentStore';
import { Department } from '@/types/department';
import { useState } from 'react';

export const useDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    departments,
    setDepartments,
    addDepartment,
    updateDepartment: updateDepartmentInStore,
    removeDepartment: removeDepartmentFromStore,
    getDepartmentBySlug: getDepartmentBySlugFromStore,
  } = useDepartmentStore();

  // 載入所有部門
  const loadDepartments = async () => {
    if (departments.length > 0 || isLoading) return;

    setIsLoading(true);
    const data = await getAllDepartments();
    setDepartments(data);
    setIsLoading(false);
  };

  // 創建新部門
  const createDepartment = async (
    departmentData: Omit<Department, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ): Promise<Department | null> => {
    setIsLoading(true);
    const newDepartment = await createDepartmentService(departmentData);
    setIsLoading(false);

    if (newDepartment) {
      addDepartment(newDepartment);
    }

    return newDepartment;
  };

  // 更新部門
  const updateDepartment = async (
    slug: string,
    departmentData: Partial<Department>
  ): Promise<Department | null> => {
    setIsLoading(true);
    const updatedDepartment = await updateDepartmentService(slug, departmentData);
    setIsLoading(false);

    if (updatedDepartment) {
      updateDepartmentInStore(updatedDepartment.slug, updatedDepartment);
    }

    return updatedDepartment;
  };

  // 刪除部門
  const deleteDepartment = async (slug: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await deleteDepartmentService(slug);
    setIsLoading(false);

    if (success) {
      // 從 store 中移除
      const departmentToRemove = getDepartmentBySlugFromStore(slug);
      if (departmentToRemove) {
        removeDepartmentFromStore(departmentToRemove.slug);
      }
    }

    return success;
  };

  return {
    // 狀態
    departments,
    isLoading,

    // 操作方法
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
