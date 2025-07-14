import { CompanyDataService } from '@/components/company/services/companyDataService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Branch, Company, NewBranch } from '@/types/company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CompanyState {
  // 資料狀態
  company: Company | null;
  branches: Branch[];
  filteredBranches: Branch[];
  selectedBranch: Branch | null;
  loading: boolean;

  // Actions
  setCompany: (company: Company | null) => void;
  setBranches: (branches: Branch[]) => void;
  setFilteredBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setLoading: (loading: boolean) => void;

  // Business Actions
  loadCompany: () => Promise<void>;
  loadBranches: () => Promise<Branch[]>;
  addBranch: (branch: NewBranch) => Promise<boolean>;
  updateBranch: (branchId: string, branchData: Partial<Branch>) => Promise<boolean>;
  deleteBranch: (id: string) => Promise<boolean>;
  updateCompany: (company: Company) => Promise<boolean>;
  getBranchByCode: (code: string) => Branch | undefined;
  getActiveBranches: () => Branch[];
  forceSyncFromBackend: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      company: null,
      branches: [],
      filteredBranches: [],
      selectedBranch: null,
      loading: false,

      // 基本 Actions
      setCompany: company => set({ company }),
      setBranches: branches => set({ branches, filteredBranches: branches }),
      setFilteredBranches: filteredBranches => set({ filteredBranches }),
      setSelectedBranch: selectedBranch => set({ selectedBranch }),
      setLoading: loading => set({ loading }),

      // Business Actions
      loadCompany: async () => {
        console.log('🔍 companyStore: 開始載入公司資料...');
        set({ loading: true });

        try {
          const data = await CompanyDataService.findCompany();
          console.log('🔍 companyStore: 查詢結果:', data);

          set({ company: data });

          if (data) {
            console.log('✅ companyStore: 成功載入公司資料:', data.name);
          } else {
            console.log('⚠️ companyStore: 無法載入公司資料');
            toast({
              title: '找不到公司資料',
              description: '後台資料庫中沒有找到公司資料，請使用強制同步功能',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('❌ companyStore: 載入公司資料失敗:', error);
          set({ company: null });

          let errorMessage = '無法從後台資料庫載入公司資料';
          if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast({
            title: '載入失敗',
            description: `無法載入公司資料: ${errorMessage}`,
            variant: 'destructive',
          });
        } finally {
          set({ loading: false });
        }
      },

      loadBranches: async () => {
        const { company } = get();
        if (!company?.id) {
          console.log('⚠️ companyStore: 沒有公司ID，跳過載入分支機構');
          set({ branches: [], filteredBranches: [] });
          return [];
        }

        console.log('🔍 companyStore: 載入分支機構...', company.id);

        try {
          const { data, error } = await supabase
            .from('branches')
            .select('*')
            .eq('company_id', company.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('❌ companyStore: 載入分支機構失敗:', error);
            set({ branches: [], filteredBranches: [] });
            return [];
          }

          console.log('✅ companyStore: 載入分支機構成功:', data?.length || 0, '筆');
          const branchData = (data as Branch[]) || [];
          set({ branches: branchData, filteredBranches: branchData });
          return branchData;
        } catch (error) {
          console.error('💥 companyStore: 載入分支機構時發生錯誤:', error);
          set({ branches: [], filteredBranches: [] });
          return [];
        }
      },

      addBranch: async (branchData: NewBranch) => {
        const { company, loadBranches } = get();
        if (!company?.id) {
          console.error('❌ companyStore: 沒有公司ID，無法新增分支機構');
          return false;
        }

        console.log('➕ companyStore: 新增分支機構:', branchData);

        try {
          const { data, error } = await supabase
            .from('branches')
            .insert({
              ...branchData,
              company_id: company.id,
            })
            .select()
            .single();

          if (error) {
            console.error('❌ companyStore: 新增分支機構失敗:', error);
            return false;
          }

          console.log('✅ companyStore: 新增分支機構成功');
          await loadBranches();
          return true;
        } catch (error) {
          console.error('💥 companyStore: 新增分支機構時發生錯誤:', error);
          return false;
        }
      },

      updateBranch: async (branchId: string, branchData: Partial<Branch>) => {
        const { loadBranches } = get();
        console.log('🔄 companyStore: 更新分支機構:', branchId, branchData);

        try {
          const { error } = await supabase
            .from('branches')
            .update({
              ...branchData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', branchId);

          if (error) {
            console.error('❌ companyStore: 更新分支機構失敗:', error);
            return false;
          }

          console.log('✅ companyStore: 更新分支機構成功');
          await loadBranches();
          return true;
        } catch (error) {
          console.error('💥 companyStore: 更新分支機構時發生錯誤:', error);
          return false;
        }
      },

      deleteBranch: async (branchId: string) => {
        const { loadBranches } = get();
        console.log('🗑️ companyStore: 刪除分支機構:', branchId);

        try {
          const { error } = await supabase.from('branches').delete().eq('id', branchId);

          if (error) {
            console.error('❌ companyStore: 刪除分支機構失敗:', error);
            return false;
          }

          console.log('✅ companyStore: 刪除分支機構成功');
          await loadBranches();
          return true;
        } catch (error) {
          console.error('💥 companyStore: 刪除分支機構時發生錯誤:', error);
          return false;
        }
      },

      updateCompany: async (updatedCompany: Company) => {
        console.log('🔄 companyStore: 開始更新公司資料');

        try {
          // 直接更新本地狀態
          set({ company: updatedCompany });

          console.log('✅ companyStore: 本地狀態更新成功');

          toast({
            title: '更新成功',
            description: `已成功更新${updatedCompany.name}資料`,
          });
          return true;
        } catch (error) {
          console.error('❌ companyStore: 處理公司資料失敗:', error);

          let errorMessage = '無法處理公司資料';
          if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast({
            title: '處理失敗',
            description: errorMessage,
            variant: 'destructive',
          });
          return false;
        }
      },

      forceSyncFromBackend: async () => {
        console.log('🔄 companyStore: 開始強制從後台同步資料...');
        set({ loading: true });

        try {
          let syncedCompany = await CompanyDataService.findCompany();

          if (!syncedCompany) {
            console.log('🔄 companyStore: 沒有找到公司資料，創建標準資料...');
            syncedCompany = await CompanyDataService.createStandardCompany();
          }

          if (syncedCompany) {
            set({ company: syncedCompany });
            console.log('✅ companyStore: 強制同步成功:', syncedCompany.name);

            toast({
              title: '同步成功',
              description: `已成功同步${syncedCompany.name}資料`,
            });
          } else {
            throw new Error('同步過程中發生錯誤');
          }
        } catch (error) {
          console.error('❌ companyStore: 強制同步失敗:', error);

          let errorMessage = '無法同步公司資料';
          if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast({
            title: '同步失敗',
            description: `無法從後台同步公司資料: ${errorMessage}`,
            variant: 'destructive',
          });
        } finally {
          set({ loading: false });
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
      name: 'company-store',
    }
  )
);
