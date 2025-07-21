import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { NewBranch } from '@/types/company';
import { useState } from 'react';

export const useBranches = () => {
  const [loading, setLoading] = useState(false);
  const {
    branches: data,
    setBranches,
    addBranch: addToStore,
    removeBranch: removeFromStore,
  } = useBranchStore();

  const loadBranches = async (companyId?: string) => {
    if (!companyId || data.length > 0) return;

    setLoading(true);
    try {
      const branches = await branchService.loadBranches(companyId);
      setBranches(branches);
    } catch (error) {
      console.error('載入分支失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async (companyId: string, newBranch: NewBranch) => {
    try {
      const created = await branchService.addBranch(companyId, newBranch);
      addToStore(created);
      return created;
    } catch (error) {
      console.error('新增分支失敗:', error);
      throw error;
    }
  };

  const deleteBranch = async (branchId: string) => {
    try {
      await branchService.deleteBranch(branchId);
      removeFromStore(branchId);
    } catch (error) {
      console.error('刪除分支失敗:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    loadBranches,
    createBranch,
    deleteBranch,
  };
};
