
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Company } from '@/types/company';
import { CompanyValidationService } from '../services/companyValidationService';
import { CompanyDataPreparer } from '../services/companyDataPreparer';
import { CompanyApiService } from '../services/companyApiService';

export const useCompanyOperations = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();

  // 在組件掛載時立即載入指定ID的公司資料
  useEffect(() => {
    console.log('🚀 useCompanyOperations: 開始載入指定ID的公司資料');
    loadCompany();
  }, []);

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

  // 載入指定ID的公司資料
  const loadCompany = async () => {
    console.log('🔍 useCompanyOperations: 開始載入指定ID的公司資料...');
    setLoading(true);
    
    try {
      const data = await CompanyApiService.loadCompany();
      console.log('🔍 useCompanyOperations: API 返回的資料:', data);
      
      setCompany(data);
      
      if (data) {
        console.log('✅ useCompanyOperations: 成功載入指定公司資料:', data.name);
        console.log('🆔 useCompanyOperations: 公司ID:', data.id);
        console.log('🏢 useCompanyOperations: 統一編號:', data.registration_number);
        
        toast({
          title: "載入成功",
          description: `已載入依美琦股份有限公司資料`,
        });
      } else {
        console.log('⚠️ useCompanyOperations: 指定ID的公司資料不存在');
        toast({
          title: "找不到公司資料",
          description: "後台資料庫中沒有依美琦股份有限公司的資料",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanyOperations: 載入公司資料失敗:', error);
      setCompany(null);
      
      toast({
        title: "載入失敗",
        description: "無法從後台資料庫載入公司資料",
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
    
    setLoading(true);
    
    try {
      console.log('🔍 useCompanyOperations: 開始資料驗證和處理...');
      
      // 驗證必填欄位
      const validation = CompanyValidationService.validateCompanyData(updatedCompany);
      if (!validation.isValid) {
        throw new Error(CompanyValidationService.getValidationErrorMessage(validation.missingFields));
      }

      // 驗證統一編號格式
      if (!CompanyValidationService.validateRegistrationNumber(updatedCompany.registration_number)) {
        throw new Error('統一編號必須為8位數字');
      }

      // 驗證電子郵件格式
      if (!CompanyValidationService.validateEmail(updatedCompany.email)) {
        throw new Error('電子郵件格式不正確');
      }

      // 準備資料
      const companyData = CompanyDataPreparer.prepareCompanyData(updatedCompany);
      console.log('📄 useCompanyOperations: 準備處理的資料:', companyData);

      // 執行更新
      const result = await CompanyApiService.updateCompany(companyData, company?.id);
      console.log('✅ useCompanyOperations: 操作成功，返回的資料:', result);
      
      // 更新本地狀態
      setCompany(result);
      
      toast({
        title: "更新成功",
        description: "已成功更新依美琦股份有限公司資料"
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
    } finally {
      setLoading(false);
    }
  };

  return {
    company,
    setCompany,
    loadCompany,
    updateCompany,
    loading
  };
};
