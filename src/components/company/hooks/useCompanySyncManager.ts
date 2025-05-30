import { useState, useCallback } from 'react';
import { Company } from '@/types/company';
import { CompanyDataService } from '../services/companyDataService';
import { useToast } from '@/hooks/use-toast';

export const useCompanySyncManager = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [syncStatus, setSyncStatus] = useState<'unknown' | 'synced' | 'not_synced'>('unknown');
  const { toast } = useToast();

  // 載入公司資料
  const loadCompany = useCallback(async () => {
    console.log('🔄 useCompanySyncManager: 載入公司資料...');
    setLoading(true);
    
    try {
      const company = await CompanyDataService.findCompany();
      setCompany(company);
      
      if (company) {
        const validation = CompanyDataService.validateCompanyData(company);
        setSyncStatus(validation.isValid ? 'synced' : 'not_synced');
        
        toast({
          title: "載入成功",
          description: `已載入 ${company.name} 的資料`,
        });
      } else {
        setSyncStatus('not_synced');
        toast({
          title: "未找到公司資料",
          description: "請使用強制同步功能載入公司資料",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanySyncManager: 載入公司資料失敗:', error);
      setSyncStatus('not_synced');
      setCompany(null);
      
      let errorMessage = "無法載入公司資料";
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
  }, [toast]);

  // 強制同步
  const forceSync = useCallback(async (): Promise<boolean> => {
    console.log('🔄 useCompanySyncManager: 開始強制同步...');
    setLoading(true);
    
    try {
      // 先嘗試查找現有資料
      let company = await CompanyDataService.findCompany();
      
      if (!company) {
        // 如果沒有找到，創建標準資料
        console.log('➕ useCompanySyncManager: 創建標準公司資料...');
        company = await CompanyDataService.createStandardCompany();
        
        toast({
          title: "同步成功",
          description: "已創建新的公司資料",
        });
      } else {
        toast({
          title: "同步成功",
          description: "已找到並載入現有公司資料",
        });
      }
      
      setCompany(company);
      setSyncStatus('synced');
      return true;
      
    } catch (error) {
      console.error('❌ useCompanySyncManager: 強制同步失敗:', error);
      setSyncStatus('not_synced');
      
      let errorMessage = "同步過程發生未知錯誤";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "同步失敗",
        description: `強制同步過程發生錯誤: ${errorMessage}`,
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
      setSyncStatus('synced');
      
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

  // 檢查同步狀態
  const checkSyncStatus = useCallback(async () => {
    try {
      const { isSynced, company: syncedCompany } = await CompanySyncService.checkSyncStatus();
      setSyncStatus(isSynced ? 'synced' : 'not_synced');
      if (syncedCompany) {
        setCompany(syncedCompany);
      }
    } catch (error) {
      console.error('❌ useCompanySyncManager: 檢查同步狀態失敗:', error);
      setSyncStatus('not_synced');
    }
  }, []);

  return {
    company,
    loading,
    syncStatus,
    loadCompany,
    forceSync,
    updateCompany,
    checkSyncStatus
  };
};
