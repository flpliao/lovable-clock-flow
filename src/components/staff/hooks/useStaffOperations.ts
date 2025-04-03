
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Staff, NewStaff } from '../types';
import { mockStaffList } from '../mockData';

export const useStaffOperations = () => {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaffList);
  const { toast } = useToast();
  const { currentUser, isAdmin, canManageUser } = useUser();

  // Filter staff list based on permissions
  const filteredStaffList = isAdmin() 
    ? staffList 
    : staffList.filter(staff => staff.id === currentUser?.id);

  const handleAddStaff = (newStaff: NewStaff) => {
    if (!newStaff.name || !newStaff.position || !newStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return false;
    }

    // Only admins can add new staff
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增人員",
        variant: "destructive"
      });
      return false;
    }

    const staffToAdd = {
      id: `${staffList.length + 1}`,
      ...newStaff
    };

    setStaffList([...staffList, staffToAdd]);
    
    toast({
      title: "新增成功",
      description: `已成功新增 ${staffToAdd.name} 至人員列表`
    });
    
    return true;
  };

  const handleEditStaff = (currentStaff: Staff) => {
    if (!currentStaff || !currentStaff.name || !currentStaff.position || !currentStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return false;
    }

    // Check if user has permission to edit this staff member
    if (!canManageUser(currentStaff.id)) {
      toast({
        title: "權限不足",
        description: "您沒有權限編輯此人員",
        variant: "destructive"
      });
      return false;
    }

    // Check for circular reference in supervision hierarchy
    if (currentStaff.supervisor_id && currentStaff.supervisor_id === currentStaff.id) {
      toast({
        title: "設置錯誤",
        description: "不能設置自己為上級主管",
        variant: "destructive"
      });
      return false;
    }

    // Check if this would create a circular reference in the hierarchy
    const wouldCreateCircularReference = (staffId: string, supervisorId: string): boolean => {
      let current = supervisorId;
      const visited = new Set<string>();
      
      while (current) {
        if (current === staffId) return true;
        if (visited.has(current)) return true;
        
        visited.add(current);
        const supervisor = staffList.find(s => s.id === current);
        current = supervisor?.supervisor_id || '';
      }
      
      return false;
    };

    if (currentStaff.supervisor_id && wouldCreateCircularReference(currentStaff.id, currentStaff.supervisor_id)) {
      toast({
        title: "設置錯誤",
        description: "此設置將導致組織結構循環引用",
        variant: "destructive"
      });
      return false;
    }

    setStaffList(staffList.map(staff => 
      staff.id === currentStaff.id ? currentStaff : staff
    ));
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${currentStaff.name} 的資料`
    });
    
    return true;
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

    // Check if this staff is a supervisor to others
    const hasSubordinates = staffList.some(staff => staff.supervisor_id === id);
    if (hasSubordinates) {
      toast({
        title: "無法刪除",
        description: "此人員是其他員工的上級主管，請先調整組織結構",
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

  return {
    staffList,
    filteredStaffList,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
  };
};
