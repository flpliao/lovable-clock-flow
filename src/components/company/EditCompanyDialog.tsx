
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useEditCompanyDialog } from './hooks/useEditCompanyDialog';
import EditCompanyDialogContent from './forms/EditCompanyDialogContent';

const EditCompanyDialog = () => {
  const {
    isEditCompanyDialogOpen,
    isSubmitting,
    editedCompany,
    setEditedCompany,
    hasPermission,
    contextCompany,
    handleSubmit,
    handleClose
  } = useEditCompanyDialog();

  console.log('EditCompanyDialog - 渲染狀態:', { 
    isEditCompanyDialogOpen,
    hasPermission,
    companyExists: !!contextCompany,
    formDataName: editedCompany.name
  });

  return (
    <Dialog open={isEditCompanyDialogOpen} onOpenChange={handleClose}>
      <EditCompanyDialogContent
        editedCompany={editedCompany}
        setEditedCompany={setEditedCompany}
        isSubmitting={isSubmitting}
        hasPermission={hasPermission}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Dialog>
  );
};

export default EditCompanyDialog;
