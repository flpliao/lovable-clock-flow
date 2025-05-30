
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useDataLoader } from './useDataLoader';

export const useSupabaseCompanyOperations = () => {
  const {
    company,
    setCompany,
    loadCompany,
    updateCompany,
    loading: companyLoading
  } = useCompanyOperations();

  const {
    branches,
    setBranches,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  } = useBranchOperations(company?.id || '');

  const {
    loading: dataLoading,
    refreshData
  } = useDataLoader();

  return {
    company,
    branches,
    loading: companyLoading || dataLoading,
    updateCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    refreshData
  };
};
