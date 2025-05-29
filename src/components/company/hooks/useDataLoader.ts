
import { useState, useEffect } from 'react';

export const useDataLoader = (loadCompany: () => Promise<void>, loadBranches: () => Promise<void>) => {
  const [loading, setLoading] = useState(true);

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadCompany(), loadBranches()]);
      setLoading(false);
    };
    loadData();
  }, [loadCompany, loadBranches]);

  const refreshData = () => Promise.all([loadCompany(), loadBranches()]);

  return {
    loading,
    refreshData
  };
};
