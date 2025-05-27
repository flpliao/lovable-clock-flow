
import { useState } from 'react';
import { Staff, NewStaff } from '../types';

export const useStaffDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: '',
    position: '',
    department: '',
    branch_id: '',
    contact: '',
    role: 'user',
    role_id: 'user'
  });

  const openEditDialog = (staff: Staff) => {
    setCurrentStaff({...staff});
    setIsEditDialogOpen(true);
  };

  const resetNewStaff = () => {
    setNewStaff({
      name: '',
      position: '',
      department: '',
      branch_id: '',
      contact: '',
      role: 'user',
      role_id: 'user'
    });
  };

  return {
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
  };
};
