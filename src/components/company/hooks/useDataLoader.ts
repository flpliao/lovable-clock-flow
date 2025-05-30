
import { useState } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company);
  const { initializeDefaultBranch } = useBranchInitializer();
  const { currentUser } = useUser();

  // 載入所有資料
  const loadAllData = async () => {
    console.log('🔄 開始載入所有資料...');
    setLoading(true);
    
    try {
      // 先載入公司資料
      console.log('📋 正在載入公司資料...');
      await loadCompany();
      
      // 然後初始化預設營業處（如果需要）
      console.log('🏢 正在初始化預設營業處...');
      await initializeDefaultBranch();
      
      // 最後載入營業處資料
      console.log('🏪 正在載入營業處資料...');
      await loadBranches();
      
      console.log('✅ 所有資料載入完成');
    } catch (error) {
      console.error('❌ 載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    console.log('🔄 手動重新整理資料...');
    await loadAllData();
  };

  // 當進入頁面時立即載入資料
  useEffect(() => {
    console.log('🚀 頁面載入，開始載入公司資料');
    loadAllData();
  }, []); // 移除對 currentUser 的依賴，直接載入

  return {
    loading,
    loadAllData,
    refreshData
  };
};
