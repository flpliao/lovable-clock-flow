import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useUserLoaded } from '@/hooks/useStores';
import { Company } from '@/types/company';
import { useEffect, useState } from 'react';
import { CompanyApiService } from '../services/companyApiService';
import { CompanyDataService } from '../services/companyDataService';

export const useCompanyOperations = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const isUserLoaded = useUserLoaded();

  // 在用戶載入完成後載入公司資料
  useEffect(() => {
    console.log('🚀 useCompanyOperations: useEffect 觸發');
    console.log('👤 useCompanyOperations: 用戶載入狀態:', isUserLoaded);
    console.log('👤 useCompanyOperations: 當前用戶:', currentUser?.name);
    
    if (isUserLoaded) {
      console.log('✅ useCompanyOperations: 用戶載入完成，開始載入公司資料');
      loadCompany();
    }
  }, [isUserLoaded]);

  // 設定即時監聽
  useEffect(() => {
    const channel = CompanyApiService.subscribeToCompanyChanges((updatedCompany) => {
      console.log('🔄 useCompanyOperations: 收到公司資料變更:', updatedCompany);
      setCompany(updatedCompany);
    });

    return () => {
      console.log('🔌 useCompanyOperations: 取消監聽公司資料變更');
      channel.unsubscribe();
    };
  }, []);

  // 載入公司資料
  const loadCompany = async () => {
    console.log('🔍 useCompanyOperations: 開始載入依美琦股份有限公司資料...');
    setLoading(true);
    
    try {
      // 直接使用 CompanyDataService 來載入資料
      const data = await CompanyDataService.findCompany();
      console.log('🔍 useCompanyOperations: 查詢結果:', data);
      
      setCompany(data);
      
      if (data) {
        console.log('✅ useCompanyOperations: 成功載入依美琦股份有限公司資料:', data.name);
        console.log('🆔 useCompanyOperations: 公司ID:', data.id);
        console.log('🏢 useCompanyOperations: 統一編號:', data.registration_number);
      } else {
        console.log('⚠️ useCompanyOperations: 無法載入依美琦股份有限公司資料');
        toast({
          title: "找不到公司資料",
          description: "後台資料庫中沒有找到依美琦股份有限公司的資料，請使用強制同步功能",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanyOperations: 載入公司資料失敗:', error);
      setCompany(null);
      
      let errorMessage = "無法從後台資料庫載入公司資料";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "載入失敗",
        description: `無法載入公司資料: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 強制從後台同步資料
  const forceSyncFromBackend = async () => {
    console.log('🔄 useCompanyOperations: 開始強制從後台同步資料...');
    setLoading(true);
    
    try {
      // 先嘗試創建標準公司資料，如果已存在則會跳過
      let syncedCompany = await CompanyDataService.findCompany();
      
      if (!syncedCompany) {
        console.log('🔄 useCompanyOperations: 沒有找到公司資料，創建標準資料...');
        syncedCompany = await CompanyDataService.createStandardCompany();
      }
      
      if (syncedCompany) {
        setCompany(syncedCompany);
        console.log('✅ useCompanyOperations: 強制同步成功:', syncedCompany.name);
        
        toast({
          title: "同步成功",
          description: `已成功同步${syncedCompany.name}資料`,
        });
      } else {
        throw new Error('同步過程中發生錯誤');
      }
    } catch (error) {
      console.error('❌ useCompanyOperations: 強制同步失敗:', error);
      
      let errorMessage = "無法同步公司資料";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "同步失敗",
        description: `無法從後台同步公司資料: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 更新公司資料
  const updateCompany = async (updatedCompany: Company): Promise<boolean> => {
    console.log('🔄 useCompanyOperations: 開始更新公司資料');
    console.log('📋 useCompanyOperations: 當前用戶:', currentUser?.name);
    console.log('📋 useCompanyOperations: 提交的資料:', updatedCompany);
    
    try {
      // 驗證用戶權限
      if (!CompanyApiService.validateUserPermission(currentUser?.role_id || '')) {
        throw new Error('您沒有權限編輯公司資料');
      }

      console.log('✅ useCompanyOperations: 權限驗證通過，更新本地狀態');
      
      // 直接更新本地狀態
      setCompany(updatedCompany);
      
      console.log('✅ useCompanyOperations: 本地狀態更新成功');
      
      toast({
        title: "更新成功",
        description: `已成功更新${updatedCompany.name}資料`
      });
      return true;
    } catch (error) {
      console.error('❌ useCompanyOperations: 處理公司資料失敗:', error);
      
      let errorMessage = "無法處理公司資料";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "處理失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    company,
    setCompany,
    loadCompany,
    updateCompany,
    forceSyncFromBackend,
    loading
  };
};
