
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
    deleteBranch
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
    }
  };

  const handleEditBranch = async () => {
    if (currentBranch) {
      const success = await updateBranch(currentBranch);
      if (success) {
        setIsEditBranchDialogOpen(false);
        setCurrentBranch(null);
      }
    }
  };

  const handleDeleteBranch = async (id: string) => {
    await deleteBranch(id);
  };

  const handleUpdateCompany = async (updatedCompany: Company): Promise<boolean> => {
    return await updateCompany(updatedCompany);
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
