
import { useState, useEffect } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';
import { CompanyApiService } from '../services/companyApiService';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company);
  const { initializeDefaultBranch } = useBranchInitializer();

  const loadAllData = async () => {
    console.log('🔄 useDataLoader: 開始載入所有資料...');
    setLoading(true);
    
    try {
      // 1. 強制重新載入公司資料
      console.log('📋 useDataLoader: 強制重新載入公司資料...');
      await loadCompany();
      
      // 2. 短暫延遲確保狀態更新
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 3. 檢查是否需要創建預設公司資料
      const targetId = CompanyApiService.getTargetCompanyId();
      console.log('🎯 useDataLoader: 檢查目標公司ID:', targetId);
      
      // 4. 如果沒有正確的公司資料，嘗試創建
      if (!company || company.id !== targetId) {
        console.log('🔧 useDataLoader: 公司資料不存在或ID不匹配，嘗試創建...');
        const createdCompany = await CompanyApiService.loadCompany();
        if (createdCompany) {
          console.log('✅ useDataLoader: 成功創建/載入公司資料:', createdCompany.name);
        }
      }
      
      // 5. 再次載入以確保資料是最新的
      await loadCompany();
      
      // 6. 載入營業處資料
      console.log('🏪 useDataLoader: 載入營業處資料...');
      await loadBranches();
      
      // 7. 初始化預設營業處
      console.log('🏢 useDataLoader: 初始化預設營業處...');
      await initializeDefaultBranch();
      
      console.log('✅ useDataLoader: 所有資料載入完成');
    } catch (error) {
      console.error('❌ useDataLoader: 載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('🔄 useDataLoader: 手動重新整理資料...');
    await loadAllData();
  };

  // 當元件掛載時載入資料
  useEffect(() => {
    console.log('🚀 useDataLoader: 頁面載入，開始載入資料');
    loadAllData();
  }, []);

  return {
    loading,
    loadAllData,
    refreshData
  };
};
