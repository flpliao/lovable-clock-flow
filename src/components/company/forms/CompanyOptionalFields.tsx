
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Company } from '@/types/company';

interface CompanyOptionalFieldsProps {
  editedCompany: Partial<Company>;
  setEditedCompany: (company: Partial<Company>) => void;
  isSubmitting: boolean;
  hasPermission: boolean;
}

const CompanyOptionalFields: React.FC<CompanyOptionalFieldsProps> = ({
  editedCompany,
  setEditedCompany,
  isSubmitting,
  hasPermission
}) => {
  return (
    <>
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
          min="0"
          step="1"
          value={editedCompany.capital || ''}
          onChange={(e) => {
            const value = e.target.value === '' ? null : Number(e.target.value);
            setEditedCompany({ ...editedCompany, capital: value });
          }}
          placeholder="請輸入資本額"
          disabled={isSubmitting || !hasPermission}
        />
      </div>
    </>
  );
};

export default CompanyOptionalFields;
