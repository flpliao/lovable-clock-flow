
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
    deleteDepartment: supabaseDeleteDepartment
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

    const success = await supabaseAddDepartment(newDepartment);
    if (success) {
      resetNewDepartment();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditDepartment = async () => {
    if (!validateEditDepartment(currentDepartment)) {
      return;
    }

    const success = await supabaseUpdateDepartment(currentDepartment!);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    await supabaseDeleteDepartment(id);
  };

  const openEditDialog = (department: Department) => {
    if (!checkEditPermission(department)) {
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
    openEditDialog
  };
};
