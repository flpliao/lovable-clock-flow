
import { Branch } from '@/types/company';

export const useBranchUtils = (branches: Branch[]) => {
  const getBranchByCode = (code: string): Branch | undefined => {
    return branches.find(branch => branch.code === code);
  };

  const getActiveBranches = (): Branch[] => {
    return branches.filter(branch => branch.is_active);
  };

  const filteredBranches = branches;

  return {
    getBranchByCode,
    getActiveBranches,
    filteredBranches
  };
};
