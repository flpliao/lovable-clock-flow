
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Company } from '@/types/company';
import CompanyBasicFields from './CompanyBasicFields';
import CompanyContactFields from './CompanyContactFields';
import CompanyOptionalFields from './CompanyOptionalFields';
import CompanyFormActions from './CompanyFormActions';

interface EditCompanyDialogContentProps {
  editedCompany: Partial<Company>;
  setEditedCompany: (company: Partial<Company>) => void;
  isSubmitting: boolean;
  hasPermission: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditCompanyDialogContent: React.FC<EditCompanyDialogContentProps> = ({
  editedCompany,
  setEditedCompany,
  isSubmitting,
  hasPermission,
  onSubmit,
  onCancel
}) => {
  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>編輯公司基本資料</DialogTitle>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
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
          onCancel={onCancel}
        />
      </form>
    </DialogContent>
  );
};

export default EditCompanyDialogContent;
