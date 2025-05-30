
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyFormValidation } from './forms/CompanyFormValidation';
import { useCompanyFormData } from './forms/useCompanyFormData';
import CompanyBasicFields from './forms/CompanyBasicFields';
import CompanyContactFields from './forms/CompanyContactFields';
import CompanyOptionalFields from './forms/CompanyOptionalFields';
import CompanyFormActions from './forms/CompanyFormActions';

const EditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    company,
    handleUpdateCompany
  } = useCompanyManagementContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  // 允許廖俊雄和管理員操作
  const hasPermission = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  const { editedCompany, setEditedCompany, resetFormData } = useCompanyFormData(
    company, 
    isEditCompanyDialogOpen
  );

  const formValidation = new CompanyFormValidation(toast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 開始提交表單，當前資料:', editedCompany);
    console.log('🔐 當前用戶:', currentUser?.name);

    if (!formValidation.validateForm(editedCompany)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 準備乾淨的資料
      const cleanedData = {
        name: editedCompany.name?.toString().trim() || '',
        registration_number: editedCompany.registration_number?.toString().trim() || '',
        legal_representative: editedCompany.legal_representative?.toString().trim() || '',
        business_type: editedCompany.business_type?.toString().trim() || '',
        address: editedCompany.address?.toString().trim() || '',
        phone: editedCompany.phone?.toString().trim() || '',
        email: editedCompany.email?.toString().trim() || '',
        website: editedCompany.website?.toString().trim() || '',
        established_date: editedCompany.established_date?.toString().trim() || '',
        capital: editedCompany.capital ? Number(editedCompany.capital) : null
      };

      console.log('🧹 清理後的資料:', cleanedData);

      // 建立完整的公司資料物件
      const companyData = {
        id: company?.id || crypto.randomUUID(),
        ...cleanedData,
        created_at: company?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Company;

      console.log('📝 準備提交的完整資料:', companyData);

      const success = await handleUpdateCompany(companyData);
      if (success) {
        console.log('✅ 公司資料更新成功');
        setIsEditCompanyDialogOpen(false);
        resetFormData();
        toast({
          title: "儲存成功",
          description: company ? "公司基本資料已成功更新" : "公司基本資料已成功建立"
        });
      } else {
        console.log('❌ 公司資料更新失敗');
      }
    } catch (error) {
      console.error('💥 提交表單時發生錯誤:', error);
      toast({
        title: "儲存失敗",
        description: error instanceof Error ? error.message : "儲存時發生未知錯誤",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
