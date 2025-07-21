import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { NewBranch } from '@/types/company';
import { useState } from 'react';

export const useBranch = () => {
  const { branches, setBranches, addBranch, removeBranch } = useBranchStore();
  const [loading, setLoading] = useState(false);

  const loadBranches = async (companyId?: string) => {
    if (!companyId || branches.length > 0) return;
    setLoading(true);
    try {
      const data = await branchService.loadBranches(companyId);
      setBranches(data);
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async (companyId: string, newBranch: NewBranch) => {
    setLoading(true);
    try {
      const created = await branchService.addBranch(companyId, newBranch);
      addBranch(created);
      return created;
    } finally {
      setLoading(false);
    }
  };

  const deleteBranch = async (branchId: string) => {
    setLoading(true);
    try {
      await branchService.deleteBranch(branchId);
      removeBranch(branchId);
    } finally {
      setLoading(false);
    }
  };

  return {
    branches,
    loading,
    loadBranches,
    createBranch,
    deleteBranch,
  };
};
