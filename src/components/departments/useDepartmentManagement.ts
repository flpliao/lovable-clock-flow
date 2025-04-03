
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Department, NewDepartment } from './types';
import { mockDepartments } from './mockData';

export const useDepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
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

  // All departments are visible
  const filteredDepartments = departments;

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return;
    }

    // Only admins can add new departments
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增部門/門市",
        variant: "destructive"
      });
      return;
    }

    const departmentToAdd = {
      id: `${departments.length + 1}`,
      ...newDepartment,
      staffCount: 0
    };

    setDepartments([...departments, departmentToAdd]);
    setNewDepartment({
      name: '',
      type: 'department',
      location: '',
      managerName: '',
      managerContact: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "新增成功",
      description: `已成功新增 ${departmentToAdd.name} 至部門/門市列表`
    });
  };

  const handleEditDepartment = () => {
    if (!currentDepartment || !currentDepartment.name || !currentDepartment.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯部門/門市",
        variant: "destructive"
      });
      return;
    }

    setDepartments(departments.map(dept => 
      dept.id === currentDepartment.id ? currentDepartment : dept
    ));
    setIsEditDialogOpen(false);
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${currentDepartment.name} 的資料`
    });
  };

  const handleDeleteDepartment = (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除部門/門市",
        variant: "destructive"
      });
      return;
    }

    // Check if there are staff in this department
    const deptToDelete = departments.find(dept => dept.id === id);
    if (deptToDelete && deptToDelete.staffCount > 0) {
      toast({
        title: "無法刪除",
        description: `${deptToDelete.name} 中還有 ${deptToDelete.staffCount} 名員工，請先將員工移至其他部門`,
        variant: "destructive"
      });
      return;
    }

    setDepartments(departments.filter(dept => dept.id !== id));
    
    toast({
      title: "刪除成功",
      description: "已成功從列表中移除該部門/門市"
    });
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
