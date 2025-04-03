import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

// 模擬的員工資料
const mockStaffList = [
  { id: '1', name: '王小明', position: '主管', department: '人資部', contact: '0912-345-678', role: 'admin' as const },
  { id: '2', name: '李小華', position: '工程師', department: '技術部', contact: '0923-456-789', role: 'user' as const },
  { id: '3', name: '張小美', position: '設計師', department: '設計部', contact: '0934-567-890', role: 'user' as const },
  { id: '4', name: '廖俊雄', position: '資深工程師', department: '技術部', contact: '0945-678-901', role: 'user' as const },
];

interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin';
}

interface NewStaff {
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin';
}

interface StaffManagementContextType {
  staffList: Staff[];
  filteredStaffList: Staff[];
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  handleAddStaff: () => void;
  handleEditStaff: () => void;
  handleDeleteStaff: (id: string) => void;
  openEditDialog: (staff: Staff) => void;
}

const StaffManagementContext = createContext<StaffManagementContextType | undefined>(undefined);

export const StaffManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  return (
    <StaffManagementContext.Provider value={{ 
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
    }}>
      {children}
    </StaffManagementContext.Provider>
  );
};

export const useStaffManagement = (): StaffManagementContextType => {
  const context = useContext(StaffManagementContext);
  if (context === undefined) {
    throw new Error('useStaffManagement must be used within a StaffManagementProvider');
  }
  return context;
};
