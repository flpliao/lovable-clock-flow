import { CompanyDataService } from '@/components/company/services/companyDataService';
import { toast } from '@/hooks/use-toast';
import { Company } from '@/types/company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CompanyState {
  // 資料狀態
  company: Company | null;
  loading: boolean;

  // Actions
  setCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;

  // Business Actions
  loadCompany: () => Promise<void>;
  updateCompany: (company: Company) => Promise<boolean>;
  forceSyncFromBackend: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      company: null,
      loading: false,

      // 基本 Actions
      setCompany: company => set({ company }),
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
    }),
    {
      name: 'company-store',
    }
  )
);
