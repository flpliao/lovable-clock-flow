
import { useEffect } from 'react';
import { useStaffDataLoader } from './useStaffDataLoader';
import { useStaffCrudOperations } from './useStaffCrudOperations';
import { useUser } from '@/contexts/UserContext';

export const useSupabaseStaffOperations = () => {
  const { currentUser } = useUser();
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

  // 載入資料，不再依賴用戶登錄狀態
  useEffect(() => {
    console.log('Loading staff data...');
    refreshData();
  }, []); // 移除對 currentUser 的依賴

  return {
    staffList,
    roles,
    loading,
    addStaff,
    updateStaff,
    deleteStaff,
    refreshData
  };
};
