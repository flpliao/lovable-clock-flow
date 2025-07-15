import { Branch } from '@/types/company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BranchState {
  // 資料狀態
  branches: Branch[];

  // Actions
  setBranches: (branches: Branch[]) => void;

  // Business Actions
  addBranch: (branch: Branch) => void;
  updateBranch: (branchId: string, branchData: Partial<Branch>) => void;
  removeBranch: (branchId: string) => void;
  getBranchByCode: (code: string) => Branch | undefined;
  getActiveBranches: () => Branch[];
}

export const useBranchStore = create<BranchState>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      branches: [],

      // 基本 Actions
      setBranches: branches => set({ branches }),

      // Business Actions
      addBranch: (branch: Branch) => {
        const { branches } = get();
        set({ branches: [branch, ...branches] });
      },

      updateBranch: (branchId: string, branchData: Partial<Branch>) => {
        const { branches } = get();
        const updatedBranches = branches.map(branch =>
          branch.id === branchId ? { ...branch, ...branchData } : branch
        );
        set({ branches: updatedBranches });
      },

      removeBranch: (branchId: string) => {
        const { branches } = get();
        const filteredBranches = branches.filter(branch => branch.id !== branchId);
        set({ branches: filteredBranches });
      },

      // 輔助方法
      getBranchByCode: (code: string) => {
        const { branches } = get();
        return branches.find(branch => branch.code === code);
      },

      getActiveBranches: () => {
        const { branches } = get();
        return branches.filter(branch => branch.is_active);
      },
    }),
    {
      name: 'branch-store',
    }
  )
);
