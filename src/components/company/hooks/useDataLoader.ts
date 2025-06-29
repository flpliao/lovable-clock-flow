
import { useState, useEffect } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { CompanyApiService } from '../services/companyApiService';
import { useUser } from '@/contexts/UserContext';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company?.id || '');
  const { currentUser, isUserLoaded } = useUser();

  const loadAllData = async () => {
    console.log('🔄 useDataLoader: 開始載入所有資料...');
    console.log('👤 useDataLoader: 當前用戶:', currentUser?.name, 'ID:', currentUser?.id);
    console.log('👤 useDataLoader: 用戶載入狀態:', isUserLoaded);
    
    // 如果用戶還沒載入完成，則等待
    if (!isUserLoaded) {
      console.log('⏳ useDataLoader: 等待用戶載入完成...');
      return;
    }
    
    setLoading(true);
    
    try {
      // 驗證用戶權限
      if (currentUser?.id && !CompanyApiService.validateUserPermission(currentUser.id)) {
        console.warn('⚠️ useDataLoader: 用戶無權限訪問公司資料');
        setLoading(false);
        return;
      }

      // 1. 載入公司資料
      console.log('📋 useDataLoader: 載入公司資料...');
      await loadCompany();
      
      // 2. 短暫延遲確保狀態更新
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 3. 載入營業處資料
      console.log('🏪 useDataLoader: 載入營業處資料...');
      await loadBranches();
      
      console.log('✅ useDataLoader: 所有資料載入完成');
    } catch (error) {
      console.error('❌ useDataLoader: 載入資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('🔄 useDataLoader: 手動重新整理資料...');
    console.log('👤 useDataLoader: 用戶身份:', currentUser?.name, currentUser?.id);
    await loadAllData();
  };

  // 當用戶載入完成且用戶存在時才開始載入資料
  useEffect(() => {
    console.log('🚀 useDataLoader: useEffect 觸發');
    console.log('👤 useDataLoader: 用戶載入狀態:', isUserLoaded);
    console.log('👤 useDataLoader: 用戶狀態:', currentUser?.name, currentUser?.id);
    
    if (isUserLoaded && currentUser?.id) {
      console.log('✅ useDataLoader: 開始載入資料');
      loadAllData();
    } else if (isUserLoaded && !currentUser?.id) {
      console.log('⚠️ useDataLoader: 用戶載入完成但沒有用戶資料');
      setLoading(false);
    }
  }, [currentUser?.id, isUserLoaded]);

  return {
    loading,
    loadAllData,
    refreshData
  };
};
