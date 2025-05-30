
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/types/company';

interface CompanyBasicFieldsProps {
  editedCompany: Partial<Company>;
  setEditedCompany: (company: Partial<Company>) => void;
  isSubmitting: boolean;
  hasPermission: boolean;
}

const CompanyBasicFields: React.FC<CompanyBasicFieldsProps> = ({
  editedCompany,
  setEditedCompany,
  isSubmitting,
  hasPermission
}) => {
  return (
    <>
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
            onChange={(e) => {
              // 只允許數字輸入
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 8) {
                setEditedCompany({ ...editedCompany, registration_number: value });
              }
            }}
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
    </>
  );
};

export default CompanyBasicFields;
