
import { useState } from 'react';
import { Department, NewDepartment, DepartmentManagementContextType } from './types';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useSupabaseDepartmentOperations } from './hooks/useSupabaseDepartmentOperations';
import { useUser } from '@/contexts/UserContext';
import { DataSyncManager } from '@/utils/dataSync';
import { DepartmentGeocodingService } from './services/departmentGeocodingService';

export const useDepartmentManagement = (): DepartmentManagementContextType => {
  const { isAdmin, currentUser } = useUser();
  const [searchFilter, setSearchFilter] = useState('');

  // 使用 Supabase 操作 hooks
  const {
    loading,
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refreshDepartments
  } = useSupabaseDepartmentOperations();

  // 使用對話框管理 hooks
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    newDepartment,
    setNewDepartment,
    openEditDialog,
    resetNewDepartment
  } = useDepartmentDialogs();

  // 篩選部門
  const filteredDepartments = departments.filter(department =>
    searchFilter === '' ||
    department.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    department.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (department.location && department.location.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (department.manager_name && department.manager_name.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // 新增部門處理
  const handleAddDepartment = async (): Promise<boolean> => {
    if (!isAdmin()) {
      console.warn('⚠️ 非管理員用戶嘗試新增部門');
      return false;
    }

    console.log('➕ 開始新增部門:', newDepartment);
    const success = await addDepartment(newDepartment);
    
    if (success) {
      resetNewDepartment();
      setIsAddDialogOpen(false);
      console.log('✅ 部門新增成功，重新同步後台資料');
      // 新增成功後重新同步資料
      await refreshDepartments();
    }
    
    return success;
  };

  // 編輯部門處理
  const handleEditDepartment = async (): Promise<boolean> => {
    if (!isAdmin()) {
      console.warn('⚠️ 非管理員用戶嘗試編輯部門');
      return false;
    }

    if (!currentDepartment) {
      console.warn('⚠️ 沒有選擇要編輯的部門');
      return false;
    }

    console.log('✏️ 開始編輯部門:', currentDepartment);
    const success = await updateDepartment(currentDepartment);
    
    if (success) {
      setIsEditDialogOpen(false);
      console.log('✅ 部門編輯成功，重新同步後台資料');
      // 編輯成功後重新同步資料
      await refreshDepartments();
    }
    
    return success;
  };

  // 刪除部門處理
  const handleDeleteDepartment = async (id: string) => {
    if (!isAdmin()) {
      console.warn('⚠️ 非管理員用戶嘗試刪除部門');
      return;
    }

    console.log('🗑️ 開始刪除部門, ID:', id);
    const success = await deleteDepartment(id);
    
    if (success) {
      console.log('✅ 部門刪除成功，重新同步後台資料');
      // 刪除成功後重新同步資料
      await refreshDepartments();
    }
  };

  // 手動觸發完整同步
  const performFullSync = async () => {
    console.log('🔄 部門管理：手動觸發完整系統資料同步');
    const syncResult = await DataSyncManager.performFullSync();
    await refreshDepartments();
    return syncResult;
  };

  // 新增地址轉GPS功能
  const convertAddressToGPS = async (departmentId: string, address: string): Promise<boolean> => {
    if (!isAdmin()) {
      console.warn('⚠️ 非管理員用戶嘗試轉換地址');
      return false;
    }

    console.log('🗺️ 開始轉換部門地址為GPS:', { departmentId, address });
    const success = await DepartmentGeocodingService.convertDepartmentAddressToGPS(departmentId, address);
    
    if (success) {
      console.log('✅ 地址轉GPS成功，重新載入部門資料');
      await refreshDepartments();
    }
    
    return success;
  };

  return {
    // 基本狀態
    loading,
    departments,
    filteredDepartments,
    searchFilter,
    setSearchFilter,

    // 對話框狀態
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    newDepartment,
    setNewDepartment,

    // 操作方法
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    openEditDialog,
    refreshDepartments,
    performFullSync,
    convertAddressToGPS, // 新增這個屬性到返回物件中

    // 權限檢查
    canManage: isAdmin(),
    currentUser
  };
};
