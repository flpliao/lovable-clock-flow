
import { useStaffOperations } from './useStaffOperations';
import { useStaffHierarchy } from './useStaffHierarchy';
import { useStaffDialogs } from './useStaffDialogs';

export const useStaffManagement = () => {
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

  // Combine the add staff functionality
  const handleAddStaffSubmit = () => {
    const success = handleAddStaff(newStaff);
    if (success) {
      resetNewStaff();
      setIsAddDialogOpen(false);
    }
  };

  // Combine the edit staff functionality
  const handleEditStaffSubmit = () => {
    if (currentStaff) {
      const success = handleEditStaff(currentStaff);
      if (success) {
        setIsEditDialogOpen(false);
      }
    }
  };

  return {
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
    getSubordinates
  };
};
