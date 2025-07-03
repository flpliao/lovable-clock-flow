import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { Company } from '@/types/company';
import { useCallback, useState } from 'react';
import { CompanyDataService } from '../services/companyDataService';

export const useCompanySyncManager = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const currentUser = useCurrentUser();

  const hasAdminPermission = useCallback(() => {
    return currentUser?.role_id === 'admin';
  }, [currentUser]);

  // 載入公司資料 - 增強錯誤處理
  const loadCompany = useCallback(async () => {
    console.log('🔄 useCompanySyncManager: 載入公司資料...');
    setLoading(true);
    
    try {
      const company = await CompanyDataService.findCompany();
      setCompany(company);
      
      if (company) {
        console.log('✅ useCompanySyncManager: 成功載入公司資料:', company.name);
        toast({
          title: "載入成功",
          description: `已載入 ${company.name} 的資料`,
        });
      } else {
        console.log('⚠️ useCompanySyncManager: 未找到公司資料');
        toast({
          title: "未找到資料",
          description: "資料庫中沒有找到公司資料，請使用強制同步功能",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanySyncManager: 載入公司資料失敗:', error);
      setCompany(null);
      
      // 根據錯誤類型提供不同的提示
      let errorMessage = "載入公司資料時發生錯誤";
      if (error instanceof Error) {
        if (error.message.includes('連線失敗')) {
          errorMessage = "資料庫連線失敗，請檢查網路連線或重新整理頁面";
        } else if (error.message.includes('PGRST')) {
          errorMessage = "資料庫服務暫時無法使用，請稍後再試";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "載入失敗",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 同步公司資料 - 增強連線檢查
  const syncCompany = useCallback(async (): Promise<boolean> => {
    console.log('🔄 useCompanySyncManager: 開始同步公司資料...');
    
    // 權限檢查
    if (!hasAdminPermission()) {
      toast({
        title: "權限不足",
        description: "只有廖俊雄或系統管理員可以執行同步操作",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    
    try {
      console.log('🔑 useCompanySyncManager: 廖俊雄執行同步操作');
      
      // 執行強制同步
      const company = await CompanyDataService.forceSync();
      setCompany(company);
      
      toast({
        title: "同步成功",
        description: `已成功同步 ${company.name} 的資料`,
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ useCompanySyncManager: 同步失敗:', error);
      
      // 提供詳細的錯誤訊息和解決建議
      let errorMessage = '同步過程發生錯誤';
      let suggestions = '';
      
      if (error instanceof Error) {
        if (error.message.includes('連線失敗')) {
          errorMessage = '資料庫連線失敗';
          suggestions = '請檢查網路連線或重新整理頁面';
        } else if (error.message.includes('PGRST')) {
          errorMessage = 'Supabase API 連線問題';
          suggestions = '請稍後再試或重新整理頁面';
        } else if (error.message.includes('timeout')) {
          errorMessage = '連線逾時';
          suggestions = '請檢查網路速度或稍後再試';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "同步失敗",
        description: `${errorMessage}${suggestions ? '\n' + suggestions : ''}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, hasAdminPermission]);

  // 更新公司資料
  const updateCompany = useCallback(async (updatedData: Partial<Company>): Promise<boolean> => {
    if (!hasAdminPermission()) {
      toast({
        title: "權限不足",
        description: "只有廖俊雄或系統管理員可以修改公司資料",
        variant: "destructive"
      });
      return false;
    }

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
  }, [company, toast, hasAdminPermission]);

  return {
    company,
    loading,
    loadCompany,
    syncCompany,
    updateCompany,
    hasAdminPermission: hasAdminPermission()
  };
};
