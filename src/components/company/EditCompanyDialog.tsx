
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { Company } from '@/types/company';

const EditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    company,
    handleUpdateCompany
  } = useCompanyManagementContext();

  const [editedCompany, setEditedCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (company && isEditCompanyDialogOpen) {
      setEditedCompany({ ...company });
    }
  }, [company, isEditCompanyDialogOpen]);

  if (!editedCompany) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateCompany(editedCompany);
  };

  return (
    <Dialog open={isEditCompanyDialogOpen} onOpenChange={setIsEditCompanyDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>編輯公司基本資料</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company-name">公司名稱 *</Label>
            <Input
              id="company-name"
              value={editedCompany.name}
              onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
              placeholder="請輸入公司名稱"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registration-number">統一編號 *</Label>
              <Input
                id="registration-number"
                value={editedCompany.registration_number}
                onChange={(e) => setEditedCompany({ ...editedCompany, registration_number: e.target.value })}
                placeholder="請輸入統一編號"
                required
              />
            </div>
            <div>
              <Label htmlFor="legal-representative">法定代表人 *</Label>
              <Input
                id="legal-representative"
                value={editedCompany.legal_representative}
                onChange={(e) => setEditedCompany({ ...editedCompany, legal_representative: e.target.value })}
                placeholder="請輸入法定代表人"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="business-type">營業項目 *</Label>
            <Input
              id="business-type"
              value={editedCompany.business_type}
              onChange={(e) => setEditedCompany({ ...editedCompany, business_type: e.target.value })}
              placeholder="請輸入營業項目"
              required
            />
          </div>

          <div>
            <Label htmlFor="company-address">公司地址 *</Label>
            <Textarea
              id="company-address"
              value={editedCompany.address}
              onChange={(e) => setEditedCompany({ ...editedCompany, address: e.target.value })}
              placeholder="請輸入公司完整地址"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-phone">公司電話 *</Label>
              <Input
                id="company-phone"
                value={editedCompany.phone}
                onChange={(e) => setEditedCompany({ ...editedCompany, phone: e.target.value })}
                placeholder="請輸入公司電話"
                required
              />
            </div>
            <div>
              <Label htmlFor="company-email">公司Email *</Label>
              <Input
                id="company-email"
                type="email"
                value={editedCompany.email}
                onChange={(e) => setEditedCompany({ ...editedCompany, email: e.target.value })}
                placeholder="請輸入公司Email"
                required
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
              />
            </div>
            <div>
              <Label htmlFor="established-date">成立日期</Label>
              <Input
                id="established-date"
                type="date"
                value={editedCompany.established_date}
                onChange={(e) => setEditedCompany({ ...editedCompany, established_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capital">資本額</Label>
            <Input
              id="capital"
              type="number"
              value={editedCompany.capital || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, capital: Number(e.target.value) })}
              placeholder="請輸入資本額"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditCompanyDialogOpen(false)}
            >
              取消
            </Button>
            <Button type="submit">
              儲存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
