
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useDataLoader } from './useDataLoader';

export const useSupabaseCompanyOperations = () => {
  const {
    company,
    setCompany,
    loadCompany,
    updateCompany
  } = useCompanyOperations();

  const {
    branches,
    setBranches,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  } = useBranchOperations(company);

  const {
    loading,
    refreshData
  } = useDataLoader(loadCompany, loadBranches);

  return {
    company,
    branches,
    loading,
    updateCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    refreshData
  };
};
