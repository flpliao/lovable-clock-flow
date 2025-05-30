
import { useState, useEffect } from 'react';
import { useCompanyOperations } from './useCompanyOperations';
import { useBranchOperations } from './useBranchOperations';
import { useBranchInitializer } from './useBranchInitializer';
import { CompanyApiService } from '../services/companyApiService';
import { useUser } from '@/contexts/UserContext';

export const useDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const { loadCompany, company } = useCompanyOperations();
  const { loadBranches } = useBranchOperations(company);
  const { initializeDefaultBranch } = useBranchInitializer();
  const { currentUser } = useUser();

  const loadAllData = async () => {
    console.log('🔄 useDataLoader: 開始載入所有資料...');
    console.log('👤 useDataLoader: 當前用戶:', currentUser?.name, 'ID:', currentUser?.id);
    
    setLoading(true);
    
    try {
      // 驗證用戶權限
      if (currentUser?.id && !CompanyApiService.validateUserPermission(currentUser.id)) {
        console.warn('⚠️ useDataLoader: 用戶無權限訪問公司資料');
        return;
      }

      // 1. 強制重新載入公司資料
      console.log('📋 useDataLoader: 強制重新載入公司資料...');
      await loadCompany();
      
      // 2. 短暫延遲確保狀態更新
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 3. 檢查是否需要創建預設公司資料
      const targetId = CompanyApiService.getTargetCompanyId();
      console.log('🎯 useDataLoader: 檢查目標公司ID:', targetId);
      console.log('📊 useDataLoader: 當前公司狀態:', company?.id, company?.name);
      
      // 4. 如果沒有正確的公司資料，嘗試創建
      if (!company || company.id !== targetId) {
        console.log('🔧 useDataLoader: 公司資料不存在或ID不匹配，嘗試創建...');
        console.log('  - 當前公司ID:', company?.id);
        console.log('  - 期望公司ID:', targetId);
        
        const createdCompany = await CompanyApiService.loadCompany();
        if (createdCompany) {
          console.log('✅ useDataLoader: 成功創建/載入公司資料:', createdCompany.name);
          console.log('🆔 useDataLoader: 公司ID確認:', createdCompany.id);
        }
      } else {
        console.log('✅ useDataLoader: 公司ID匹配，資料正確');
      }
      
      // 5. 再次載入以確保資料是最新的
      console.log('🔄 useDataLoader: 重新載入以確保資料同步...');
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
    console.log('👤 useDataLoader: 用戶身份:', currentUser?.name, currentUser?.id);
    await loadAllData();
  };

  // 當元件掛載時載入資料
  useEffect(() => {
    console.log('🚀 useDataLoader: 頁面載入，開始載入資料');
    console.log('👤 useDataLoader: 用戶狀態:', currentUser?.name, currentUser?.id);
    loadAllData();
  }, [currentUser?.id]); // 依賴用戶ID變化

  return {
    loading,
    loadAllData,
    refreshData
  };
};
