
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export const useDataLoader = (loadCompany: () => Promise<void>, loadBranches: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();

  const refreshData = async () => {
    if (!currentUser?.id) {
      console.log('No user logged in, skipping data refresh');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('正在刷新公司與營業處資料...');
      await Promise.all([loadCompany(), loadBranches()]);
    } catch (error) {
      console.error('刷新資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始載入資料
  useEffect(() => {
    if (currentUser?.id) {
      refreshData();
    }
  }, [currentUser?.id]);

  return {
    loading,
    refreshData
  };
};
