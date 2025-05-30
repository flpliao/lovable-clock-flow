
import { useState } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany } = useCompanyOperations();
  const { loadBranches } = useBranchOperations();
  const { initializeDefaultBranch } = useBranchInitializer();
  const { currentUser } = useUser();

  // 載入所有資料
  const loadAllData = async () => {
    if (!currentUser?.id) {
      console.log('No user logged in, skipping data load');
      return;
    }

    console.log('開始載入公司和營業處資料...');
    setLoading(true);
    
    try {
      // 先初始化預設營業處（如果需要）
      await initializeDefaultBranch();
      
      // 並行載入公司和營業處資料
      await Promise.all([
        loadCompany(),
        loadBranches()
      ]);
      
      console.log('所有資料載入完成');
    } catch (error) {
      console.error('載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    await loadAllData();
  };

  // 當用戶登錄時自動載入資料
  useEffect(() => {
    if (currentUser?.id) {
      loadAllData();
    }
  }, [currentUser?.id]);

  return {
    loading,
    loadAllData,
    refreshData
  };
};
