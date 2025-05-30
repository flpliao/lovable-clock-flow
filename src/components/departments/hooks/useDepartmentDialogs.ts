
import { useState } from 'react';
import { Department, NewDepartment } from '../types';

export const useDepartmentDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    name: '',
    type: 'department',
    location: '',
    managerName: '',
    managerContact: ''
  });

  const resetNewDepartment = () => {
    setNewDepartment({
      name: '',
      type: 'department',
      location: '',
      managerName: '',
      managerContact: ''
    });
  };

  const openEditDialog = (department: Department) => {
    setCurrentDepartment({...department});
    setIsEditDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    newDepartment,
    setNewDepartment,
    resetNewDepartment,
    openEditDialog
  };
};
