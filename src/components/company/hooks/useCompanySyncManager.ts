
import { useState, useCallback } from 'react';
import { Company } from '@/types/company';
import { CompanyDataService } from '../services/companyDataService';
import { useToast } from '@/hooks/use-toast';

export const useCompanySyncManager = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  // 載入公司資料
  const loadCompany = useCallback(async () => {
    console.log('🔄 useCompanySyncManager: 載入公司資料...');
    setLoading(true);
    
    try {
      const company = await CompanyDataService.findCompany();
      setCompany(company);
      
      if (company) {
        toast({
          title: "載入成功",
          description: `已載入 ${company.name} 的資料`,
        });
      } else {
        toast({
          title: "未找到公司資料",
          description: "請使用同步功能載入公司資料",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanySyncManager: 載入公司資料失敗:', error);
      setCompany(null);
      
      toast({
        title: "載入失敗",
        description: `無法載入公司資料: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 同步公司資料
  const syncCompany = useCallback(async (): Promise<boolean> => {
    console.log('🔄 useCompanySyncManager: 開始同步公司資料...');
    setLoading(true);
    
    try {
      let company = await CompanyDataService.findCompany();
      
      if (!company) {
        console.log('➕ useCompanySyncManager: 創建標準公司資料...');
        company = await CompanyDataService.createStandardCompany();
        
        toast({
          title: "同步成功",
          description: "已創建新的公司資料",
        });
      } else {
        toast({
          title: "同步成功",
          description: "已載入現有公司資料",
        });
      }
      
      setCompany(company);
      return true;
      
    } catch (error) {
      console.error('❌ useCompanySyncManager: 同步失敗:', error);
      
      toast({
        title: "同步失敗",
        description: `同步過程發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 更新公司資料
  const updateCompany = useCallback(async (updatedData: Partial<Company>): Promise<boolean> => {
    if (!company?.id) {
      toast({
        title: "更新失敗",
        description: "沒有可更新的公司資料",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    
    try {
      const mergedData = { ...company, ...updatedData } as Company;
      const validation = CompanyDataService.validateCompanyData(mergedData);
      
      if (!validation.isValid) {
        toast({
          title: "資料驗證失敗",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return false;
      }

      const updatedCompany = await CompanyDataService.updateCompany(company.id, updatedData);
      setCompany(updatedCompany);
      
      toast({
        title: "更新成功",
        description: "公司資料已成功更新",
      });
      
      return true;
    } catch (error) {
      console.error('❌ useCompanySyncManager: 更新公司資料失敗:', error);
      
      toast({
        title: "更新失敗",
        description: `無法更新公司資料: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [company, toast]);

  return {
    company,
    loading,
    loadCompany,
    syncCompany,
    updateCompany
  };
};
