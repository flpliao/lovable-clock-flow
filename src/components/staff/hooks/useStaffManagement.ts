
import { useStaffOperations } from './useStaffOperations';
import { useStaffHierarchy } from './useStaffHierarchy';
import { useStaffDialogs } from './useStaffDialogs';
import { useRoleManagement } from './useRoleManagement';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export const useStaffManagement = () => {
  const { currentUser, isAdmin } = useUser();

  const {
    staffList,
    filteredStaffList,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff
  } = useStaffOperations();

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

  // 初始化時顯示載入狀態並觸發資料載入
  useEffect(() => {
    console.log('🚀 員工管理系統初始化');
    console.log('👤 當前用戶:', currentUser?.name);
    console.log('🔐 管理員權限:', isAdmin());
    console.log('📊 員工數量:', staffList.length);
    
    // 如果沒有員工資料，顯示提示
    if (staffList.length === 0) {
      console.log('⚠️ 檢測到無員工資料，需要從後台載入');
    }
  }, [currentUser, staffList.length, isAdmin]);

  // Combine the add staff functionality
  const handleAddStaffSubmit = async (): Promise<boolean> => {
    const success = await handleAddStaff(newStaff);
    if (success) {
      resetNewStaff();
      setIsAddDialogOpen(false);
    }
    return success;
  };

  // Combine the edit staff functionality
  const handleEditStaffSubmit = async (): Promise<boolean> => {
    if (currentStaff) {
      const success = await handleEditStaff(currentStaff);
      if (success) {
        setIsEditDialogOpen(false);
      }
      return success;
    }
    return false;
  };

  return {
    // Staff management
    staffList,
    filteredStaffList,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentStaff,
    setCurrentStaff,
    newStaff,
    setNewStaff,
    handleAddStaff: handleAddStaffSubmit,
    handleEditStaff: handleEditStaffSubmit,
    handleDeleteStaff,
    openEditDialog,
    getSupervisorName,
    getSubordinates,
    
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
