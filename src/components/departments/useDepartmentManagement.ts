
import { useUser } from '@/contexts/UserContext';
import { Department, NewDepartment } from './types';
import { useSupabaseDepartmentOperations } from './hooks/useSupabaseDepartmentOperations';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useDepartmentFormValidation } from './hooks/useDepartmentFormValidation';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';

export const useDepartmentManagement = () => {
  const { isAdmin } = useUser();

  // 使用分離的 hooks
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

  // All departments are visible
  const filteredDepartments = departments;

  const handleAddDepartment = async () => {
    if (!validateNewDepartment(newDepartment)) {
      return;
    }

    console.log('🚀 新增部門開始:', newDepartment);
    const success = await supabaseAddDepartment(newDepartment);
    if (success) {
      console.log('✅ 新增部門成功，重置表單');
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

    console.log('🚀 編輯部門開始:', currentDepartment);
    const success = await supabaseUpdateDepartment(currentDepartment);
    if (success) {
      console.log('✅ 編輯部門成功');
      await refreshDepartments();
      return true;
    }
    return false;
  };

  const handleDeleteDepartment = async (id: string) => {
    console.log('🚀 刪除部門開始:', id);
    const success = await supabaseDeleteDepartment(id);
    if (success) {
      console.log('✅ 刪除部門成功');
      await refreshDepartments();
    }
  };

  const openEditDialog = (department: Department) => {
    console.log('📝 開啟編輯對話框:', department);
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
