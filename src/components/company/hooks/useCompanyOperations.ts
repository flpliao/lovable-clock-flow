
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Company } from '@/types/company';
import { CompanyValidationService } from '../services/companyValidationService';
import { CompanyDataPreparer } from '../services/companyDataPreparer';
import { CompanyApiService } from '../services/companyApiService';

export const useCompanyOperations = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();

  // 載入公司資料
  const loadCompany = async () => {
    try {
      console.log('🔍 useCompanyOperations: 開始載入公司資料...');
      
      const data = await CompanyApiService.loadCompany();
      console.log('🔍 useCompanyOperations: API 返回的資料:', data);
      
      if (data) {
        console.log('✅ useCompanyOperations: 設定公司資料到 state:', data);
        setCompany(data);
      } else {
        console.log('⚠️ useCompanyOperations: 沒有找到公司資料，設定為 null');
        setCompany(null);
      }
    } catch (error) {
      console.error('❌ useCompanyOperations: 載入公司資料失敗:', error);
      setCompany(null);
      toast({
        title: "載入失敗",
        description: "無法載入公司資料，請重新整理頁面",
        variant: "destructive"
      });
    }
  };

  // 更新或新建公司資料
  const updateCompany = async (updatedCompany: Company): Promise<boolean> => {
    console.log('🔄 開始更新公司資料');
    console.log('📋 當前用戶:', currentUser?.name);
    console.log('📋 提交的資料:', updatedCompany);
    
    try {
      console.log('🔍 開始資料驗證和處理...');
      
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
      console.log('📄 準備處理的資料:', companyData);

      // 執行更新或新增
      const result = await CompanyApiService.updateCompany(companyData, company?.id);
      console.log('✅ 操作成功，返回的資料:', result);
      
      // 更新本地狀態
      setCompany(result);
      
      toast({
        title: company ? "更新成功" : "建立成功",
        description: company ? "已成功更新公司基本資料" : "已成功建立公司基本資料"
      });
      return true;
    } catch (error) {
      console.error('❌ 處理公司資料失敗:', error);
      
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
    updateCompany
  };
};
