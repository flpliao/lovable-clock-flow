
import { useState, useCallback } from 'react';
import { Company } from '@/types/company';
import { CompanyDataService } from '../services/companyDataService';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

export const useCompanySyncManager = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 檢查是否為廖俊雄或管理員
  const hasAdminPermission = useCallback(() => {
    return currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';
  }, [currentUser]);

  // 載入公司資料 - 完全避免觸發 staff 表 RLS
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
          description: "尚未找到公司資料，請使用強制同步功能",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useCompanySyncManager: 載入公司資料失敗:', error);
      setCompany(null);
      
      toast({
        title: "載入失敗",
        description: "無法載入公司資料，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 同步公司資料 - 針對廖俊雄的權限操作
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
      
      // 使用強制同步功能，完全避免 staff 表操作
      const company = await CompanyDataService.forceSync();
      setCompany(company);
      
      toast({
        title: "同步成功",
        description: `已成功載入 ${company.name} 的資料`,
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ useCompanySyncManager: 同步失敗:', error);
      
      // 提供更清楚的錯誤訊息
      let errorMessage = '同步過程發生錯誤';
      if (error instanceof Error) {
        if (error.message.includes('infinite recursion') || error.message.includes('RLS')) {
          errorMessage = '已避開資料庫權限問題，但仍發生錯誤，請聯繫技術支援';
        } else if (error.message.includes('連線') || error.message.includes('網路')) {
          errorMessage = '資料庫連線問題，請檢查網路連線';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "同步失敗",
        description: errorMessage,
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
