
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const EditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    company,
    handleUpdateCompany
  } = useCompanyManagementContext();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 檢查權限
  const hasPermission = isAdmin();

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

  const validateForm = () => {
    const requiredFields = [
      { field: 'name', name: '公司名稱' },
      { field: 'registration_number', name: '統一編號' },
      { field: 'legal_representative', name: '法定代表人' },
      { field: 'business_type', name: '營業項目' },
      { field: 'address', name: '公司地址' },
      { field: 'phone', name: '公司電話' },
      { field: 'email', name: '公司Email' }
    ];

    for (const { field, name } of requiredFields) {
      const value = editedCompany[field as keyof Company];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        toast({
          title: "資料不完整",
          description: `請填寫${name}`,
          variant: "destructive"
        });
        return false;
      }
    }

    // 驗證統一編號格式 (台灣統一編號為8位數字)
    const registrationNumber = (editedCompany.registration_number || '').trim();
    if (!/^\d{8}$/.test(registrationNumber)) {
      toast({
        title: "格式錯誤",
        description: "統一編號必須為8位數字",
        variant: "destructive"
      });
      return false;
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedCompany.email || '')) {
      toast({
        title: "格式錯誤",
        description: "請輸入有效的電子郵件地址",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公司資料",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log('提交公司資料:', editedCompany);

    try {
      // 建立完整的公司資料物件
      const companyData = {
        id: company?.id || crypto.randomUUID(),
        name: editedCompany.name || '',
        registration_number: editedCompany.registration_number || '',
        legal_representative: editedCompany.legal_representative || '',
        business_type: editedCompany.business_type || '',
        address: editedCompany.address || '',
        phone: editedCompany.phone || '',
        email: editedCompany.email || '',
        website: editedCompany.website || '',
        established_date: editedCompany.established_date || '',
        capital: editedCompany.capital || null,
        created_at: company?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Company;

      const success = await handleUpdateCompany(companyData);
      if (success) {
        console.log('公司資料更新成功');
        setIsEditCompanyDialogOpen(false);
        toast({
          title: company ? "更新成功" : "建立成功",
          description: company ? "已成功更新公司基本資料" : "已成功建立公司基本資料"
        });
      }
    } catch (error) {
      console.error('提交更新時發生錯誤:', error);
      toast({
        title: "提交失敗",
        description: "提交更新時發生錯誤，請重試",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsEditCompanyDialogOpen(false);
    // 重置表單資料
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
          <DialogTitle>{company ? '編輯公司基本資料' : '建立公司基本資料'}</DialogTitle>
        </DialogHeader>
        
        {!hasPermission && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">您沒有編輯公司資料的權限，只有管理員可以進行此操作。</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company-name">公司名稱 *</Label>
            <Input
              id="company-name"
              value={editedCompany.name || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
              placeholder="請輸入公司名稱"
              required
              disabled={isSubmitting || !hasPermission}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registration-number">統一編號 *</Label>
              <Input
                id="registration-number"
                value={editedCompany.registration_number || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, registration_number: e.target.value })}
                placeholder="請輸入8位數統一編號"
                required
                disabled={isSubmitting || !hasPermission}
                maxLength={8}
              />
            </div>
            <div>
              <Label htmlFor="legal-representative">法定代表人 *</Label>
              <Input
                id="legal-representative"
                value={editedCompany.legal_representative || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, legal_representative: e.target.value })}
                placeholder="請輸入法定代表人"
                required
                disabled={isSubmitting || !hasPermission}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="business-type">營業項目 *</Label>
            <Input
              id="business-type"
              value={editedCompany.business_type || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, business_type: e.target.value })}
              placeholder="請輸入營業項目"
              required
              disabled={isSubmitting || !hasPermission}
            />
          </div>

          <div>
            <Label htmlFor="company-address">公司地址 *</Label>
            <Textarea
              id="company-address"
              value={editedCompany.address || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, address: e.target.value })}
              placeholder="請輸入公司完整地址"
              required
              disabled={isSubmitting || !hasPermission}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-phone">公司電話 *</Label>
              <Input
                id="company-phone"
                value={editedCompany.phone || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, phone: e.target.value })}
                placeholder="請輸入公司電話"
                required
                disabled={isSubmitting || !hasPermission}
              />
            </div>
            <div>
              <Label htmlFor="company-email">公司Email *</Label>
              <Input
                id="company-email"
                type="email"
                value={editedCompany.email || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, email: e.target.value })}
                placeholder="請輸入公司Email"
                required
                disabled={isSubmitting || !hasPermission}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-website">公司網站</Label>
              <Input
                id="company-website"
                value={editedCompany.website || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, website: e.target.value })}
                placeholder="請輸入公司網站"
                disabled={isSubmitting || !hasPermission}
              />
            </div>
            <div>
              <Label htmlFor="established-date">成立日期</Label>
              <Input
                id="established-date"
                type="date"
                value={editedCompany.established_date || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, established_date: e.target.value })}
                disabled={isSubmitting || !hasPermission}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capital">資本額</Label>
            <Input
              id="capital"
              type="number"
              value={editedCompany.capital || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, capital: e.target.value ? Number(e.target.value) : null })}
              placeholder="請輸入資本額"
              disabled={isSubmitting || !hasPermission}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !hasPermission}
            >
              {isSubmitting ? '儲存中...' : '儲存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
