
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

  // 只有當有用戶登錄時才載入資料
  useEffect(() => {
    if (currentUser?.id) {
      console.log('User logged in, loading staff data for:', currentUser.name);
      refreshData();
    } else {
      console.log('No user logged in, skipping staff data load');
      setLoading(false);
    }
  }, [currentUser?.id]);

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
