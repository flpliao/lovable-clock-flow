
import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useCompanyManagementContext } from '../CompanyManagementContext';
import { useCompanyOperations } from './useCompanyOperations';
import { CompanyDataService } from '../services/companyDataService';
import { useCompanyFormValidation } from '../forms/useCompanyFormValidation';

export const useEditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    handleUpdateCompany
  } = useCompanyManagementContext();

  const { company: contextCompany } = useCompanyOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Partial<Company>>({
    name: '',
    registration_number: '',
    legal_representative: '',
    business_type: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    established_date: '',
    capital: null
  });

  const { toast } = useToast();
  const { currentUser } = useUser();
  const { validateForm } = useCompanyFormValidation();
  
  // 允許廖俊雄和管理員操作
  const hasPermission = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  console.log('useEditCompanyDialog - 對話框狀態:', { 
    isEditCompanyDialogOpen, 
    hasPermission, 
    userName: currentUser?.name,
    companyName: contextCompany?.name 
  });

  // 當對話框開啟時，載入並初始化表單資料
  useEffect(() => {
    console.log('useEditCompanyDialog - useEffect 觸發:', { 
      isEditCompanyDialogOpen, 
      contextCompany: contextCompany?.name 
    });
    
    if (isEditCompanyDialogOpen) {
      console.log('📝 useEditCompanyDialog: 對話框開啟，載入公司資料...');
      
      if (contextCompany) {
        console.log('📝 useEditCompanyDialog: 使用 context 中的公司資料:', contextCompany);
        initializeFormData(contextCompany);
      } else {
        console.log('📝 useEditCompanyDialog: context 中沒有公司資料，從資料庫載入...');
        loadCompanyDataFromDatabase();
      }
    }
  }, [isEditCompanyDialogOpen, contextCompany]);

  // 從資料庫載入公司資料
  const loadCompanyDataFromDatabase = async () => {
    try {
      console.log('🔍 useEditCompanyDialog: 從資料庫查詢公司資料...');
      const companyData = await CompanyDataService.findCompany();
      
      if (companyData) {
        console.log('✅ useEditCompanyDialog: 成功從資料庫載入公司資料:', companyData);
        initializeFormData(companyData);
        
        toast({
          title: "資料載入成功",
          description: `已載入 ${companyData.name} 的資料`,
        });
      } else {
        console.log('⚠️ useEditCompanyDialog: 資料庫中沒有找到公司資料');
        toast({
          title: "找不到公司資料",
          description: "資料庫中沒有找到公司資料，請先建立基本資料",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ useEditCompanyDialog: 載入公司資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法從資料庫載入公司資料，請重試",
        variant: "destructive"
      });
    }
  };

  // 初始化表單資料
  const initializeFormData = (company: Company) => {
    console.log('📝 useEditCompanyDialog: 初始化表單資料:', company);
    
    const formData = {
      name: company.name || '',
      registration_number: company.registration_number || '',
      legal_representative: company.legal_representative || '',
      business_type: company.business_type || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      established_date: company.established_date || '',
      capital: company.capital || null
    };
    
    console.log('📝 useEditCompanyDialog: 設定表單資料:', formData);
    setEditedCompany(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 useEditCompanyDialog: 開始提交表單，當前資料:', editedCompany);
    console.log('🚀 useEditCompanyDialog: 目前公司資料:', contextCompany);

    if (!hasPermission) {
      toast({
        title: "權限不足",
        description: "您沒有權限編輯公司資料",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm(editedCompany)) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 useEditCompanyDialog: 開始更新公司資料...');
      
      // 準備乾淨的資料
      const cleanedData = {
        name: editedCompany.name?.toString().trim() || '',
        registration_number: editedCompany.registration_number?.toString().trim() || '',
        legal_representative: editedCompany.legal_representative?.toString().trim() || '',
        business_type: editedCompany.business_type?.toString().trim() || '',
        address: editedCompany.address?.toString().trim() || '',
        phone: editedCompany.phone?.toString().trim() || '',
        email: editedCompany.email?.toString().trim() || '',
        website: editedCompany.website?.toString().trim() || null,
        established_date: editedCompany.established_date?.toString().trim() || null,
        capital: editedCompany.capital ? Number(editedCompany.capital) : null
      };

      console.log('🧹 useEditCompanyDialog: 清理後的資料:', cleanedData);

      if (contextCompany?.id) {
        // 直接更新後台資料
        console.log('🔄 useEditCompanyDialog: 更新現有公司資料，ID:', contextCompany.id);
        const updatedCompany = await CompanyDataService.updateCompany(contextCompany.id, cleanedData);
        console.log('✅ useEditCompanyDialog: 後台更新成功，結果:', updatedCompany);
        
        // 更新前台 context 中的資料
        console.log('🔄 useEditCompanyDialog: 更新前台 context...');
        const contextUpdateSuccess = await handleUpdateCompany(updatedCompany);
        
        if (!contextUpdateSuccess) {
          console.warn('⚠️ useEditCompanyDialog: Context 更新失敗，但後台已更新成功');
        }

        console.log('✅ useEditCompanyDialog: 公司資料更新完成:', updatedCompany.name);
        
        // 關閉對話框
        setIsEditCompanyDialogOpen(false);
        
        toast({
          title: "儲存成功",
          description: `${updatedCompany.name} 基本資料已成功更新並同步至後台`,
        });

        // 強制重新載入頁面資料以確保同步
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } else {
        console.log('⚠️ useEditCompanyDialog: 沒有公司 ID，無法更新');
        toast({
          title: "更新失敗",
          description: "找不到公司資料，無法進行更新",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('💥 useEditCompanyDialog: 提交表單時發生錯誤:', error);
      
      toast({
        title: "儲存失敗",
        description: error instanceof Error ? error.message : "儲存時發生未知錯誤，請重新整理頁面後再試",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('🚪 useEditCompanyDialog: 關閉編輯對話框');
    setIsEditCompanyDialogOpen(false);
    // 重設表單資料
    if (contextCompany) {
      initializeFormData(contextCompany);
    }
  };

  return {
    isEditCompanyDialogOpen,
    isSubmitting,
    editedCompany,
    setEditedCompany,
    hasPermission,
    contextCompany,
    handleSubmit,
    handleClose
  };
};
