
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

  // 載入資料
  useEffect(() => {
    console.log('useSupabaseStaffOperations: 載入員工資料...');
    refreshData();
  }, []);

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
