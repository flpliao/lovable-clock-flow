
import { useState, useEffect } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company);
  const { initializeDefaultBranch } = useBranchInitializer();

  const loadAllData = async () => {
    console.log('🔄 useDataLoader: 開始載入所有資料...');
    setLoading(true);
    
    try {
      // 1. 先載入公司資料
      console.log('📋 useDataLoader: 正在載入公司資料...');
      await loadCompany();
      
      // 2. 等待公司資料載入後再載入營業處
      console.log('🏪 useDataLoader: 正在載入營業處資料...');
      await loadBranches();
      
      // 3. 初始化預設營業處（如果需要）
      console.log('🏢 useDataLoader: 檢查是否需要初始化預設營業處...');
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
    const timer = setTimeout(() => {
      loadAllData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    loading,
    loadAllData,
    refreshData
  };
};
