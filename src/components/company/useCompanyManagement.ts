
import { useState } from 'react';
import { Company, Branch, NewBranch, CompanyManagementContextType } from '@/types/company';
import { useSupabaseCompanyOperations } from './hooks/useSupabaseCompanyOperations';

export const useCompanyManagement = (): CompanyManagementContextType => {
  const {
    company,
    branches,
    loading,
    updateCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    refreshData
  } = useSupabaseCompanyOperations();

  // Dialog states
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  
  // Form states
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
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

  // Filtered branches (可以在這裡加入搜尋邏輯)
  const filteredBranches = branches;

  // Handlers
  const handleAddBranch = async () => {
    const success = await addBranch(newBranch);
    if (success) {
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
      // 重新載入資料以確保同步
      await refreshData();
    }
  };

  const handleEditBranch = async () => {
    if (currentBranch) {
      const success = await updateBranch(currentBranch);
      if (success) {
        setIsEditBranchDialogOpen(false);
        setCurrentBranch(null);
        // 重新載入資料以確保同步
        await refreshData();
      }
    }
  };

  const handleDeleteBranch = async (id: string) => {
    const success = await deleteBranch(id);
    if (success) {
      // 重新載入資料以確保同步
      await refreshData();
    }
  };

  const handleUpdateCompany = async (updatedCompany: Company): Promise<boolean> => {
    console.log('useCompanyManagement: 開始更新公司資料', updatedCompany);
    
    try {
      const success = await updateCompany(updatedCompany);
      if (success) {
        console.log('useCompanyManagement: 公司資料更新成功，重新載入資料');
        // 重新載入資料以確保同步
        await refreshData();
      } else {
        console.log('useCompanyManagement: 公司資料更新失敗');
      }
      return success;
    } catch (error) {
      console.error('useCompanyManagement: 更新公司資料時發生錯誤', error);
      return false;
    }
  };

  const openEditBranchDialog = (branch: Branch) => {
    setCurrentBranch({ ...branch });
    setIsEditBranchDialogOpen(true);
  };

  // Utility functions
  const getBranchByCode = (code: string) => {
    return branches.find(branch => branch.code === code);
  };

  const getActiveBranches = () => {
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
