
import { useUser } from '@/contexts/UserContext';
import { Department, NewDepartment } from './types';
import { useSupabaseDepartmentOperations } from './hooks/useSupabaseDepartmentOperations';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useDepartmentFormValidation } from './hooks/useDepartmentFormValidation';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { useEffect } from 'react';

export const useDepartmentManagement = () => {
  const { isAdmin, currentUser } = useUser();

  const {
    departments,
    loading,
    addDepartment: supabaseAddDepartment,
    updateDepartment: supabaseUpdateDepartment,
    deleteDepartment: supabaseDeleteDepartment,
    refreshDepartments
  } = useSupabaseDepartmentOperations();

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    newDepartment,
    setNewDepartment,
    resetNewDepartment,
    openEditDialog: baseOpenEditDialog
  } = useDepartmentDialogs();

  const {
    validateNewDepartment,
    validateEditDepartment
  } = useDepartmentFormValidation();

  const {
    checkEditPermission
  } = useDepartmentOperations();

  // 初始化時顯示載入狀態並觸發資料載入
  useEffect(() => {
    console.log('🚀 部門管理系統初始化');
    console.log('👤 當前用戶:', currentUser?.name);
    console.log('🔐 管理員權限:', isAdmin());
    console.log('📊 部門數量:', departments.length);
    
    // 強制重新載入部門資料
    if (departments.length === 0 && !loading) {
      console.log('🔄 檢測到無部門資料，觸發重新載入...');
      refreshDepartments();
    }
  }, [currentUser, departments.length, isAdmin, loading, refreshDepartments]);

  // 顯示所有部門 - 廖俊雄管理員可以看到全部
  const filteredDepartments = departments;

  const handleAddDepartment = async () => {
    if (!validateNewDepartment(newDepartment)) {
      return;
    }

    console.log('➕ 廖俊雄開始新增部門:', newDepartment);
    const success = await supabaseAddDepartment(newDepartment);
    if (success) {
      console.log('✅ 部門新增成功，重置表單並重新載入');
      resetNewDepartment();
      setIsAddDialogOpen(false);
      await refreshDepartments();
    }
  };

  const handleEditDepartment = async (): Promise<boolean> => {
    if (!currentDepartment) {
      console.error('❌ 沒有選擇要編輯的部門');
      return false;
    }

    if (!validateEditDepartment(currentDepartment)) {
      console.error('❌ 部門資料驗證失敗');
      return false;
    }

    console.log('✏️ 廖俊雄開始編輯部門:', currentDepartment);
    const success = await supabaseUpdateDepartment(currentDepartment);
    if (success) {
      console.log('✅ 部門編輯成功，重新載入資料');
      await refreshDepartments();
      return true;
    }
    return false;
  };

  const handleDeleteDepartment = async (id: string) => {
    console.log('🗑️ 廖俊雄開始刪除部門:', id);
    const success = await supabaseDeleteDepartment(id);
    if (success) {
      console.log('✅ 部門刪除成功，重新載入資料');
      await refreshDepartments();
    }
  };

  const openEditDialog = (department: Department) => {
    console.log('📝 廖俊雄開啟編輯部門對話框:', department);
    if (!checkEditPermission(department)) {
      console.error('❌ 沒有編輯權限');
      return;
    }
    baseOpenEditDialog(department);
  };

  return {
    departments,
    filteredDepartments,
    loading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    newDepartment,
    setNewDepartment,
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    openEditDialog,
    refreshDepartments
  };
};
