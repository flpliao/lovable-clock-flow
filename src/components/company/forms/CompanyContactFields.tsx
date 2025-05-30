
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Company } from '@/types/company';

interface CompanyContactFieldsProps {
  editedCompany: Partial<Company>;
  setEditedCompany: (company: Partial<Company>) => void;
  isSubmitting: boolean;
  hasPermission: boolean;
}

const CompanyContactFields: React.FC<CompanyContactFieldsProps> = ({
  editedCompany,
  setEditedCompany,
  isSubmitting,
  hasPermission
}) => {
  return (
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
  );
};

export default CompanyContactFields;
