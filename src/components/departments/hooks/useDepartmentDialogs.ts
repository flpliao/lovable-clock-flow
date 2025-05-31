
import { useState } from 'react';
import { Department, NewDepartment } from '../types';

export const useDepartmentDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    name: '',
    type: 'headquarters',
    location: '',
    manager_name: '',
    manager_contact: ''
  });

  const resetNewDepartment = () => {
    setNewDepartment({
      name: '',
      type: 'headquarters',
      location: '',
      manager_name: '',
      manager_contact: ''
    });
  };

  const openEditDialog = (department: Department) => {
    setCurrentDepartment(department);
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
