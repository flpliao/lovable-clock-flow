
import { useEffect } from 'react';
import { useStaffDataLoader } from './useStaffDataLoader';
import { useStaffCrudOperations } from './useStaffCrudOperations';

export const useSupabaseStaffOperations = () => {
  const {
    staffList,
    setStaffList,
    roles,
    setRoles,
    loading,
    setLoading,
    loadStaff,
    loadRoles,
    refreshData
  } = useStaffDataLoader();

  const {
    addStaff,
    updateStaff,
    deleteStaff
  } = useStaffCrudOperations(staffList, setStaffList);

  // 初始化載入資料
  useEffect(() => {
    console.log('📋 useSupabaseStaffOperations: 初始化載入員工資料...');
    refreshData();
  }, []);

  // 當員工列表更新時，重新載入以確保同步
  const refreshAfterOperation = async () => {
    console.log('🔄 useSupabaseStaffOperations: 操作後重新載入資料...');
    await loadStaff();
  };

  return {
    staffList,
    roles,
    loading,
    addStaff: async (newStaff: any) => {
      const result = await addStaff(newStaff);
      if (result) {
        await refreshAfterOperation();
      }
      return result;
    },
    updateStaff: async (staff: any) => {
      const result = await updateStaff(staff);
      if (result) {
        await refreshAfterOperation();
      }
      return result;
    },
    deleteStaff: async (id: string) => {
      await deleteStaff(id);
      await refreshAfterOperation();
    },
    refreshData
  };
};
