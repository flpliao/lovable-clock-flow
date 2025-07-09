import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { DataSyncManager } from '@/utils/dataSync';
import { useState } from 'react';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useSupabaseDepartmentOperations } from './hooks/useSupabaseDepartmentOperations';
import { DepartmentGeocodingService } from './services/departmentGeocodingService';
import { DepartmentManagementContextType } from './types';
import {
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import { Department } from './types';

export const useDepartmentManagement = (): DepartmentManagementContextType => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'name', label: '部門名稱' },
    { value: 'type', label: '部門類型' },
    { value: 'location', label: '地址' },
    { value: 'manager_name', label: '主管姓名' },
  ];

  // 篩選函數
  const applyDepartmentFilter = (department: Department, conditionGroups: FilterGroup[]) => {
    return applyMultiConditionFilter(department, conditionGroups, (item, field) => {
      return (item[field as keyof Department] || '').toString();
    });
  };

  // 使用 Supabase 操作 hooks
  const {
    loading,
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refreshDepartments,
  } = useSupabaseDepartmentOperations();

  // 使用通用篩選 Hook
  const {
    conditionGroups,
    filteredData: filteredDepartments,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
  } = useAdvancedFilter({
    data: departments,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: applyDepartmentFilter,
  });

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
    resetNewDepartment,
  } = useDepartmentDialogs();

  // 新增部門處理
  const handleAddDepartment = async (): Promise<boolean> => {
    if (!isAdmin) {
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
    if (!isAdmin) {
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
    if (!isAdmin) {
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

  // 新增地址轉GPS功能 - 增強版本
  const convertAddressToGPS = async (departmentId: string, address: string): Promise<boolean> => {
    if (!isAdmin) {
      console.warn('⚠️ 非管理員用戶嘗試轉換地址');
      return false;
    }

    console.log('🗺️ 開始轉換部門地址為GPS:', { departmentId, address });
    const success = await DepartmentGeocodingService.convertDepartmentAddressToGPS(
      departmentId,
      address
    );

    if (success) {
      console.log('✅ 地址轉GPS成功，強制刷新部門資料');
      // 转換成功後強制重新載入所有部門資料
      await refreshDepartments();

      // 額外延遲確保資料已同步
      setTimeout(async () => {
        await refreshDepartments();
        console.log('🔄 延遲刷新完成，確保GPS狀態已更新');
      }, 1000);
    }

    return success;
  };

  return {
    // 基本狀態
    loading,
    departments,
    filteredDepartments,
    searchFilter: '', // 保持向後兼容，但不再使用
    setSearchFilter: () => {}, // 保持向後兼容，但不再使用

    // 篩選相關
    conditionGroups,
    setConditionGroups,
    showAdvancedFilters,
    setShowAdvancedFilters,
    clearAllConditions,
    appliedConditionCount,

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
    convertAddressToGPS, // 增強版的GPS轉換功能

    // 權限檢查
    canManage: isAdmin,
    currentUser,
  };
};
