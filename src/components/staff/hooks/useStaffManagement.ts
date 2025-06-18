
import { useStaffHierarchy } from './useStaffHierarchy';
import { useStaffDialogs } from './useStaffDialogs';
import { useRoleManagement } from './useRoleManagement';
import { useSupabaseStaffOperations } from './useSupabaseStaffOperations';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { DataSyncManager } from '@/utils/dataSync';

export const useStaffManagement = () => {
  const { currentUser, isAdmin } = useUser();

  // Always call hooks - never conditionally
  const {
    staffList,
    loading,
    addStaff,
    updateStaff,
    deleteStaff,
    refreshData
  } = useSupabaseStaffOperations();

  const {
    getSupervisorName,
    getSubordinates
  } = useStaffHierarchy(staffList);

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentStaff,
    setCurrentStaff,
    newStaff,
    setNewStaff,
    openEditDialog,
    resetNewStaff
  } = useStaffDialogs();
  
  const {
    roles,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff
  } = useRoleManagement(staffList);

  // 初始化時執行完整資料同步
  useEffect(() => {
    const initializeWithSync = async () => {
      console.log('🚀 員工管理系統初始化 - 開始資料同步');
      console.log('👤 當前用戶:', currentUser?.name);
      console.log('🔐 管理員權限:', isAdmin());
      
      // 執行完整資料同步
      const syncResult = await DataSyncManager.performFullSync();
      
      if (syncResult.connectionStatus) {
        console.log('✅ 後台連線正常，資料同步完成');
        if (syncResult.staffData.length === 0) {
          console.log('⚠️ 後台暫無員工資料，可開始新增');
        }
      } else {
        console.error('❌ 後台連線失敗，請檢查系統設定');
      }
      
      // 觸發本地資料載入
      await refreshData();
    };

    initializeWithSync();
  }, [currentUser, isAdmin]);

  // Combine the add staff functionality
  const handleAddStaff = async (): Promise<boolean> => {
    const success = await addStaff(newStaff);
    if (success) {
      resetNewStaff();
      setIsAddDialogOpen(false);
      // 新增成功後重新同步資料
      console.log('📊 員工新增成功，重新同步後台資料');
      await refreshData();
    }
    return success;
  };

  // Combine the edit staff functionality
  const handleEditStaff = async (): Promise<boolean> => {
    if (currentStaff) {
      const success = await updateStaff(currentStaff);
      if (success) {
        setIsEditDialogOpen(false);
        // 更新成功後重新同步資料
        console.log('📊 員工更新成功，重新同步後台資料');
        await refreshData();
      }
      return success;
    }
    return false;
  };

  // Handle delete staff
  const handleDeleteStaff = async (id: string) => {
    await deleteStaff(id);
    // 刪除成功後重新同步資料
    console.log('📊 員工刪除成功，重新同步後台資料');
    await refreshData();
  };

  // 手動觸發完整同步
  const performFullSync = async () => {
    console.log('🔄 手動觸發完整系統資料同步');
    const syncResult = await DataSyncManager.performFullSync();
    await refreshData();
    return syncResult;
  };

  return {
    // Staff management
    staffList,
    filteredStaffList: staffList, // For now, return all staff - filtering can be added later
    loading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentStaff,
    setCurrentStaff,
    newStaff,
    setNewStaff,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    openEditDialog,
    getSupervisorName,
    getSubordinates,
    refreshData,
    performFullSync, // 新增完整同步功能
    
    // Role management
    roles,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff
  };
};
