
import { useState, useEffect } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company);
  const { initializeDefaultBranch } = useBranchInitializer();

  // 載入所有資料
  const loadAllData = async () => {
    console.log('🔄 useDataLoader: 開始載入所有資料...');
    setLoading(true);
    
    try {
      // 先載入公司資料
      console.log('📋 useDataLoader: 正在載入公司資料...');
      await loadCompany();
      
      // 然後初始化預設營業處（如果需要）
      console.log('🏢 useDataLoader: 正在初始化預設營業處...');
      await initializeDefaultBranch();
      
      // 最後載入營業處資料
      console.log('🏪 useDataLoader: 正在載入營業處資料...');
      await loadBranches();
      
      console.log('✅ useDataLoader: 所有資料載入完成');
    } catch (error) {
      console.error('❌ useDataLoader: 載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    console.log('🔄 useDataLoader: 手動重新整理資料...');
    await loadAllData();
  };

  // 當元件掛載時立即載入資料
  useEffect(() => {
    console.log('🚀 useDataLoader: 頁面載入，開始載入公司資料');
    loadAllData();
  }, []); // 空依賴陣列，只在掛載時執行一次

  return {
    loading,
    loadAllData,
    refreshData
  };
};
