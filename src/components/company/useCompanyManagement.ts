
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Company, Branch, NewBranch } from '@/types/company';
import { mockCompany, mockBranches } from './mockData';

export const useCompanyManagement = () => {
  const [company, setCompany] = useState<Company | null>(mockCompany);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<NewBranch>({
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
  
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // Filter branches (show all for now, can add filters later)
  const filteredBranches = branches;
  const selectedBranch = currentBranch;

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.code || !newBranch.address || !newBranch.phone) {
      toast({
        title: "資料不完整",
        description: "請填寫營業處名稱、代碼、地址和電話",
        variant: "destructive"
      });
      return;
    }

    // Check if code already exists
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
    if (branchToDelete && branchToDelete.staff_count > 0) {
      toast({
        title: "無法刪除",
        description: `「${branchToDelete.name}」中還有 ${branchToDelete.staff_count} 名員工，請先將員工移至其他營業處`,
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

  const handleUpdateCompany = (updatedCompany: Company) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公司資料",
        variant: "destructive"
      });
      return;
    }

    setCompany({ ...updatedCompany, updated_at: new Date().toISOString() });
    setIsEditCompanyDialogOpen(false);
    
    toast({
      title: "更新成功",
      description: "已成功更新公司基本資料"
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

  const getBranchByCode = (code: string): Branch | undefined => {
    return branches.find(branch => branch.code === code);
  };

  const getActiveBranches = (): Branch[] => {
    return branches.filter(branch => branch.is_active);
  };

  return {
    company,
    branches,
    filteredBranches,
    selectedBranch,
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    currentBranch,
    setCurrentBranch,
    newBranch,
    setNewBranch,
    handleAddBranch,
    handleEditBranch,
    handleDeleteBranch,
    handleUpdateCompany,
    openEditBranchDialog,
    getBranchByCode,
    getActiveBranches
  };
};
