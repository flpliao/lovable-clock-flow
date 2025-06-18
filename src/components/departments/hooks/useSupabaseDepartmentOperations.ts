
import { useEffect, useState } from 'react';
import { Department, NewDepartment } from '../types';
import { useDepartmentState } from './useDepartmentState';
import { useDepartmentFetch } from './useDepartmentFetch';
import { useDepartmentCreate } from './useDepartmentCreate';
import { useDepartmentUpdate } from './useDepartmentUpdate';
import { useDepartmentDelete } from './useDepartmentDelete';
import { useDepartmentStaffCount } from './useDepartmentStaffCount';

export const useSupabaseDepartmentOperations = () => {
  const { loading, setLoading, departments, setDepartments } = useDepartmentState();
  const { fetchDepartments: baseFetchDepartments } = useDepartmentFetch();
  const { addDepartment: baseAddDepartment } = useDepartmentCreate();
  const { updateDepartment: baseUpdateDepartment } = useDepartmentUpdate();
  const { deleteDepartment: baseDeleteDepartment } = useDepartmentDelete();
  const { updateStaffCount } = useDepartmentStaffCount();
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      console.log('🔄 開始載入後台部門資料...');
      setLoading(true);
      const transformedData = await baseFetchDepartments();
      console.log('📥 從後台載入的部門資料:', transformedData);
      setDepartments(transformedData);
      return transformedData;
    } catch (error) {
      console.error('❌ 載入後台部門資料失敗:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshDepartments = async (): Promise<void> => {
    console.log('🔄 廖俊雄觸發重新載入後台部門資料');
    await fetchDepartments();
  };

  // 初始化時載入資料
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 初始化部門資料載入');
      fetchDepartments().then(() => {
        setIsInitialized(true);
        console.log('✅ 部門資料初始化完成');
      });
    }
  }, [isInitialized]);

  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('➕ 新增部門到後台:', newDepartment);
      const success = await baseAddDepartment(newDepartment);
      if (success) {
        console.log('✅ 部門新增成功，重新載入後台資料');
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('✏️ 更新部門到後台:', department);
      const success = await baseUpdateDepartment(department);
      if (success) {
        console.log('✅ 部門更新成功，重新載入後台資料');
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🗑️ 從後台刪除部門:', id);
      const success = await baseDeleteDepartment(id);
      if (success) {
        console.log('✅ 部門刪除成功，重新載入後台資料');
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
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
