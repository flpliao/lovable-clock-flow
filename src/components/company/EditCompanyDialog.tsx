
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
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

  // 當對話框開啟時，初始化表單資料
  useEffect(() => {
    if (isEditCompanyDialogOpen && company) {
      console.log('📝 EditCompanyDialog: 初始化編輯表單，公司資料:', company);
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
    }
  }, [company, isEditCompanyDialogOpen]);

  const validateForm = (data: Partial<Company>): boolean => {
    if (!data.name?.trim()) {
      toast({
        title: "驗證失敗",
        description: "公司名稱不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.registration_number?.trim()) {
      toast({
        title: "驗證失敗",
        description: "統一編號不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.legal_representative?.trim()) {
      toast({
        title: "驗證失敗",
        description: "法定代表人不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.business_type?.trim()) {
      toast({
        title: "驗證失敗",
        description: "營業項目不能為空",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

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

    if (!validateForm(editedCompany)) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 EditCompanyDialog: 開始更新公司資料...');
      
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

      if (company?.id) {
        // 更新現有公司
        console.log('🔄 EditCompanyDialog: 更新現有公司資料，ID:', company.id);
        const result = await CompanyDataService.updateCompany(company.id, cleanedData);
        console.log('✅ EditCompanyDialog: 後台更新成功，結果:', result);
        
        const success = await handleUpdateCompany(result);
        
        if (!success) {
          throw new Error('更新公司上下文失敗');
        }

        console.log('✅ EditCompanyDialog: 公司資料更新完成:', result.name);
        setIsEditCompanyDialogOpen(false);
        
        toast({
          title: "儲存成功",
          description: `${result.name} 基本資料已成功更新並同步至後台`,
        });
      }
      
    } catch (error) {
      console.error('💥 EditCompanyDialog: 提交表單時發生錯誤:', error);
      
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
    console.log('🚪 EditCompanyDialog: 關閉編輯對話框');
    setIsEditCompanyDialogOpen(false);
    // 重設表單資料
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
    }
  };

  return (
    <Dialog open={isEditCompanyDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>編輯公司基本資料</DialogTitle>
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
