
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyFormValidation } from './forms/CompanyFormValidation';
import CompanyBasicFields from './forms/CompanyBasicFields';
import CompanyContactFields from './forms/CompanyContactFields';
import CompanyOptionalFields from './forms/CompanyOptionalFields';
import CompanyFormActions from './forms/CompanyFormActions';
import { CompanyDataService } from './services/companyDataService';

const EditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    company,
    handleUpdateCompany
  } = useCompanyManagementContext();

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
  
  // 允許廖俊雄和管理員操作
  const hasPermission = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';
  const formValidation = new CompanyFormValidation(toast);

  // 當對話框開啟時，初始化表單資料
  useEffect(() => {
    if (isEditCompanyDialogOpen) {
      if (company) {
        console.log('編輯現有公司資料:', company);
        setEditedCompany({
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
        });
      } else {
        console.log('新建公司資料');
        setEditedCompany({
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
      }
    }
  }, [company, isEditCompanyDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 EditCompanyDialog: 開始提交表單，當前資料:', editedCompany);

    if (!hasPermission) {
      toast({
        title: "權限不足",
        description: "您沒有權限編輯公司資料",
        variant: "destructive"
      });
      return;
    }

    if (!formValidation.validateForm(editedCompany)) {
      console.log('❌ EditCompanyDialog: 表單驗證失敗');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 EditCompanyDialog: 開始處理公司資料...');
      
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

      console.log('🧹 EditCompanyDialog: 清理後的資料:', cleanedData);

      let result: Company | null = null;

      if (company?.id) {
        // 更新現有公司
        console.log('🔄 EditCompanyDialog: 更新現有公司資料...');
        try {
          result = await CompanyDataService.updateCompany(company.id, cleanedData);
          const success = await handleUpdateCompany(result);
          if (!success) {
            throw new Error('更新公司上下文失敗');
          }
        } catch (updateError) {
          console.error('❌ EditCompanyDialog: 更新失敗:', updateError);
          throw updateError;
        }
      } else {
        // 創建新公司
        console.log('➕ EditCompanyDialog: 創建新公司資料...');
        try {
          result = await CompanyDataService.createStandardCompany();
          // 使用創建的資料更新為用戶輸入的資料
          if (result) {
            result = await CompanyDataService.updateCompany(result.id, cleanedData);
            const success = await handleUpdateCompany(result);
            if (!success) {
              throw new Error('創建公司上下文失敗');
            }
          }
        } catch (createError) {
          console.error('❌ EditCompanyDialog: 創建失敗:', createError);
          throw createError;
        }
      }

      if (result) {
        console.log('✅ EditCompanyDialog: 公司資料處理成功:', result.name);
        setIsEditCompanyDialogOpen(false);
        resetFormData();
        toast({
          title: "儲存成功",
          description: company ? "公司基本資料已成功更新" : "公司基本資料已成功建立"
        });
      } else {
        throw new Error('無法處理公司資料');
      }
      
    } catch (error) {
      console.error('💥 EditCompanyDialog: 提交表單時發生錯誤:', error);
      
      let errorMessage = "儲存時發生未知錯誤";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "儲存失敗",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormData = () => {
    if (company) {
      setEditedCompany({
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
      });
    } else {
      setEditedCompany({
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
    }
  };

  const handleClose = () => {
    console.log('🚪 EditCompanyDialog: 關閉對話框');
    setIsEditCompanyDialogOpen(false);
    resetFormData();
  };

  return (
    <Dialog open={isEditCompanyDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{company ? '編輯公司基本資料' : '建立公司基本資料'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CompanyBasicFields
            editedCompany={editedCompany}
            setEditedCompany={setEditedCompany}
            isSubmitting={isSubmitting}
            hasPermission={hasPermission}
          />

          <CompanyContactFields
            editedCompany={editedCompany}
            setEditedCompany={setEditedCompany}
            isSubmitting={isSubmitting}
            hasPermission={hasPermission}
          />

          <CompanyOptionalFields
            editedCompany={editedCompany}
            setEditedCompany={setEditedCompany}
            isSubmitting={isSubmitting}
            hasPermission={hasPermission}
          />

          <CompanyFormActions
            isSubmitting={isSubmitting}
            hasPermission={hasPermission}
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
