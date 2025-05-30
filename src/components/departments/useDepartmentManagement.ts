
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Department, NewDepartment } from './types';
import { useSupabaseDepartmentOperations } from './hooks/useSupabaseDepartmentOperations';

export const useDepartmentManagement = () => {
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
  
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 使用 Supabase 操作 hook
  const {
    departments,
    loading,
    addDepartment: supabaseAddDepartment,
    updateDepartment: supabaseUpdateDepartment,
    deleteDepartment: supabaseDeleteDepartment
  } = useSupabaseDepartmentOperations();

  // All departments are visible
  const filteredDepartments = departments;

  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return;
    }

    const success = await supabaseAddDepartment(newDepartment);
    if (success) {
      setNewDepartment({
        name: '',
        type: 'department',
        location: '',
        managerName: '',
        managerContact: ''
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditDepartment = async () => {
    if (!currentDepartment || !currentDepartment.name || !currentDepartment.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return;
    }

    const success = await supabaseUpdateDepartment(currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    await supabaseDeleteDepartment(id);
  };

  const openEditDialog = (department: Department) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯部門/門市",
        variant: "destructive"
      });
      return;
    }

    setCurrentDepartment({...department});
    setIsEditDialogOpen(true);
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
