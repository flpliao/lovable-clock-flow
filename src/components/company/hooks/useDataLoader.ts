
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
    if (!currentUser?.id) {
      console.log('No user logged in, skipping data load');
      return;
    }

    console.log('開始載入公司和營業處資料...');
    setLoading(true);
    
    try {
      // 先載入公司資料
      console.log('正在載入公司資料...');
      await loadCompany();
      
      // 然後初始化預設營業處（如果需要）
      console.log('正在初始化預設營業處...');
      await initializeDefaultBranch();
      
      // 最後載入營業處資料
      console.log('正在載入營業處資料...');
      await loadBranches();
      
      console.log('所有資料載入完成');
    } catch (error) {
      console.error('載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新資料
  const refreshData = async () => {
    console.log('重新整理資料...');
    await loadAllData();
  };

  // 當用戶登錄時自動載入資料
  useEffect(() => {
    if (currentUser?.id) {
      console.log('用戶已登入，開始載入資料:', currentUser.name);
      loadAllData();
    }
  }, [currentUser?.id]);

  return {
    loading,
    loadAllData,
    refreshData
  };
};
