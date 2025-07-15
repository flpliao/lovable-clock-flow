import { useBranchStore } from '@/stores/branchStore';
import { useCompanyStore } from '@/stores/companyStore';
import { useEffect } from 'react';

export const useCompanyStoreInitializer = () => {
  const { company, loadCompany } = useCompanyStore();
  const { loadBranches } = useBranchStore();

  useEffect(() => {
    const initializeData = async () => {
      if (!company) {
        console.log('🚀 useCompanyStoreInitializer: 用戶載入完成，開始初始化資料');
        await loadCompany();
      }
    };

    initializeData();
  }, [company, loadCompany]);

  useEffect(() => {
    const loadBranchData = async () => {
      if (company) {
        console.log('🏪 useCompanyStoreInitializer: 公司資料已載入，開始載入分支資料');
        await loadBranches();
      }
    };

    loadBranchData();
  }, [company, loadBranches]);
};
