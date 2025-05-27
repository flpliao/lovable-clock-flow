
import { useCompanyState } from './hooks/useCompanyState';
import { useBranchOperations } from './hooks/useBranchOperations';
import { useCompanyOperations } from './hooks/useCompanyOperations';
import { useBranchUtils } from './hooks/useBranchUtils';

export const useCompanyManagement = () => {
  const {
    company,
    setCompany,
    branches,
    setBranches,
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    currentBranch,
    setCurrentBranch,
    newBranch,
    setNewBranch
  } = useCompanyState();

  const {
    handleAddBranch,
    handleEditBranch,
    handleDeleteBranch,
    openEditBranchDialog
  } = useBranchOperations({
    branches,
    setBranches,
    newBranch,
    setNewBranch,
    currentBranch,
    setCurrentBranch,
    setIsAddBranchDialogOpen,
    setIsEditBranchDialogOpen,
    company
  });

  const { handleUpdateCompany } = useCompanyOperations({
    setCompany,
    setIsEditCompanyDialogOpen
  });

  const {
    getBranchByCode,
    getActiveBranches,
    filteredBranches
  } = useBranchUtils(branches);

  const selectedBranch = currentBranch;

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
