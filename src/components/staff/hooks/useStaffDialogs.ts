
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Staff, NewStaff } from '../types';

export const useStaffDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: '',
    position: '',
    department: '',
    contact: '',
    role: 'user'
  });

  const { toast } = useToast();
  const { canManageUser } = useUser();

  const openEditDialog = (staff: Staff) => {
    // Check if user has permission to edit this staff member
    if (!canManageUser(staff.id)) {
      toast({
        title: "權限不足",
        description: "您沒有權限編輯此人員",
        variant: "destructive"
      });
      return;
    }

    setCurrentStaff({...staff});
    setIsEditDialogOpen(true);
  };

  const resetNewStaff = () => {
    setNewStaff({
      name: '',
      position: '',
      department: '',
      contact: '',
      role: 'user'
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
