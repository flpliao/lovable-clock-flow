
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Staff, NewStaff } from './types';
import { mockStaffList } from './mockData';

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaffList);
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
  const { currentUser, isAdmin, canManageUser } = useUser();

  // Filter staff list based on permissions
  const filteredStaffList = isAdmin() 
    ? staffList 
    : staffList.filter(staff => staff.id === currentUser?.id);

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.position || !newStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }

    // Only admins can add new staff
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增人員",
        variant: "destructive"
      });
      return;
    }

    const staffToAdd = {
      id: `${staffList.length + 1}`,
      ...newStaff
    };

    setStaffList([...staffList, staffToAdd]);
    setNewStaff({
      name: '',
      position: '',
      department: '',
      contact: '',
      role: 'user'
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "新增成功",
      description: `已成功新增 ${staffToAdd.name} 至人員列表`
    });
  };

  const handleEditStaff = () => {
    if (!currentStaff || !currentStaff.name || !currentStaff.position || !currentStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }

    // Check if user has permission to edit this staff member
    if (!canManageUser(currentStaff.id)) {
      toast({
        title: "權限不足",
        description: "您沒有權限編輯此人員",
        variant: "destructive"
      });
      return;
    }

    setStaffList(staffList.map(staff => 
      staff.id === currentStaff.id ? currentStaff : staff
    ));
    setIsEditDialogOpen(false);
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${currentStaff.name} 的資料`
    });
  };

  const handleDeleteStaff = (id: string) => {
    // Check if user has permission to delete this staff member
    if (!canManageUser(id)) {
      toast({
        title: "權限不足",
        description: "您沒有權限刪除此人員",
        variant: "destructive"
      });
      return;
    }

    setStaffList(staffList.filter(staff => staff.id !== id));
    
    toast({
      title: "刪除成功",
      description: "已成功從人員列表中移除該員工"
    });
  };

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
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    openEditDialog
  };
};
