
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Branch, NewBranch } from '@/types/company';

interface UseBranchOperationsProps {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  newBranch: NewBranch;
  setNewBranch: (branch: NewBranch) => void;
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  setIsAddBranchDialogOpen: (isOpen: boolean) => void;
  setIsEditBranchDialogOpen: (isOpen: boolean) => void;
  company: any;
  staffList?: any[];
}

export const useBranchOperations = ({
  branches,
  setBranches,
  newBranch,
  setNewBranch,
  currentBranch,
  setCurrentBranch,
  setIsAddBranchDialogOpen,
  setIsEditBranchDialogOpen,
  company,
  staffList = []
}: UseBranchOperationsProps) => {
  const { toast } = useToast();
  const { isAdmin } = useUser();

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.code || !newBranch.address || !newBranch.phone) {
      toast({
        title: "資料不完整",
        description: "請填寫營業處名稱、代碼、地址和電話",
        variant: "destructive"
      });
      return;
    }

    if (branches.some(branch => branch.code === newBranch.code)) {
      toast({
        title: "代碼重複",
        description: "此營業處代碼已存在，請使用其他代碼",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增營業處",
        variant: "destructive"
      });
      return;
    }

    const branchToAdd: Branch = {
      id: `${branches.length + 1}`,
      company_id: company?.id || '1',
      ...newBranch,
      is_active: true,
      staff_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setBranches([...branches, branchToAdd]);
    setNewBranch({
      name: '',
      code: '',
      type: 'store',
      address: '',
      phone: '',
      email: '',
      manager_name: '',
      manager_contact: '',
      business_license: ''
    });
    setIsAddBranchDialogOpen(false);
    
    toast({
      title: "新增成功",
      description: `已成功新增營業處「${branchToAdd.name}」`
    });
  };

  const handleEditBranch = () => {
    if (!currentBranch || !currentBranch.name || !currentBranch.code || !currentBranch.address || !currentBranch.phone) {
      toast({
        title: "資料不完整",
        description: "請填寫營業處名稱、代碼、地址和電話",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯營業處",
        variant: "destructive"
      });
      return;
    }

    setBranches(branches.map(branch => 
      branch.id === currentBranch.id 
        ? { ...currentBranch, updated_at: new Date().toISOString() }
        : branch
    ));
    setIsEditBranchDialogOpen(false);
    
    toast({
      title: "編輯成功",
      description: `已成功更新營業處「${currentBranch.name}」的資料`
    });
  };

  const handleDeleteBranch = (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除營業處",
        variant: "destructive"
      });
      return;
    }

    const branchToDelete = branches.find(branch => branch.id === id);
    const branchStaffCount = staffList.filter(staff => staff.branch_id === id).length;
    
    if (branchToDelete && branchStaffCount > 0) {
      toast({
        title: "無法刪除",
        description: `「${branchToDelete.name}」中還有 ${branchStaffCount} 名員工，請先將員工移至其他營業處`,
        variant: "destructive"
      });
      return;
    }

    setBranches(branches.filter(branch => branch.id !== id));
    
    toast({
      title: "刪除成功",
      description: "已成功刪除該營業處"
    });
  };

  const openEditBranchDialog = (branch: Branch) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯營業處",
        variant: "destructive"
      });
      return;
    }

    setCurrentBranch({...branch});
    setIsEditBranchDialogOpen(true);
  };

  return {
    handleAddBranch,
    handleEditBranch,
    handleDeleteBranch,
    openEditBranchDialog
  };
};
