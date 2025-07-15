import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch } from '@/types/company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useCompanyStore } from './companyStore';

interface BranchState {
  // 資料狀態
  branches: Branch[];
  filteredBranches: Branch[];
  selectedBranch: Branch | null;
  loading: boolean;

  // Actions
  setBranches: (branches: Branch[]) => void;
  setFilteredBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setLoading: (loading: boolean) => void;

  // Business Actions
  loadBranches: () => Promise<Branch[]>;
  addBranch: (branch: NewBranch) => Promise<boolean>;
  updateBranch: (branchId: string, branchData: Partial<Branch>) => Promise<boolean>;
  deleteBranch: (id: string) => Promise<boolean>;
  getBranchByCode: (code: string) => Branch | undefined;
  getActiveBranches: () => Branch[];
}

export const useBranchStore = create<BranchState>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      branches: [],
      filteredBranches: [],
      selectedBranch: null,
      loading: false,

      // 基本 Actions
      setBranches: branches => set({ branches, filteredBranches: branches }),
      setFilteredBranches: filteredBranches => set({ filteredBranches }),
      setSelectedBranch: selectedBranch => set({ selectedBranch }),
      setLoading: loading => set({ loading }),

      // Business Actions
      loadBranches: async () => {
        const companyId = useCompanyStore.getState().company?.id;
        if (!companyId) {
          console.log('⚠️ branchStore: 沒有公司ID，跳過載入單位');
          set({ branches: [], filteredBranches: [] });
          return [];
        }

        console.log('🔍 branchStore: 載入單位...', companyId);

        try {
          const { data, error } = await supabase
            .from('branches')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('❌ branchStore: 載入單位失敗:', error);
            set({ branches: [], filteredBranches: [] });
            return [];
          }

          console.log('✅ branchStore: 載入單位成功:', data?.length || 0, '筆');
          const branchData = (data as Branch[]) || [];
          set({ branches: branchData, filteredBranches: branchData });
          return branchData;
        } catch (error) {
          console.error('💥 branchStore: 載入單位時發生錯誤:', error);
          set({ branches: [], filteredBranches: [] });
          return [];
        }
      },

      addBranch: async (branchData: NewBranch) => {
        const companyId = useCompanyStore.getState().company?.id;
        if (!companyId) {
          console.error('❌ branchStore: 沒有公司ID，無法新增單位');
          return false;
        }

        console.log('➕ branchStore: 新增單位:', branchData);

        try {
          const { data, error } = await supabase
            .from('branches')
            .insert({
              ...branchData,
              company_id: companyId,
            })
            .select()
            .single();

          if (error) {
            console.error('❌ branchStore: 新增單位失敗:', error);
            return false;
          }

          console.log('✅ branchStore: 新增單位成功');
          await get().loadBranches();
          return true;
        } catch (error) {
          console.error('💥 branchStore: 新增單位時發生錯誤:', error);
          return false;
        }
      },

      updateBranch: async (branchId: string, branchData: Partial<Branch>) => {
        console.log('🔄 branchStore: 更新單位:', branchId, branchData);

        try {
          const { error } = await supabase
            .from('branches')
            .update({
              ...branchData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', branchId);

          if (error) {
            console.error('❌ branchStore: 更新單位失敗:', error);
            return false;
          }

          console.log('✅ branchStore: 更新單位成功');
          await get().loadBranches();
          return true;
        } catch (error) {
          console.error('💥 branchStore: 更新單位時發生錯誤:', error);
          return false;
        }
      },

      deleteBranch: async (branchId: string) => {
        console.log('🗑️ branchStore: 刪除單位:', branchId);

        try {
          const { error } = await supabase.from('branches').delete().eq('id', branchId);

          if (error) {
            console.error('❌ branchStore: 刪除單位失敗:', error);
            return false;
          }

          console.log('✅ branchStore: 刪除單位成功');
          await get().loadBranches();
          return true;
        } catch (error) {
          console.error('💥 branchStore: 刪除單位時發生錯誤:', error);
          return false;
        }
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
