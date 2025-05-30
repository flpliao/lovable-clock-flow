
import React from 'react';
import AddBranchDialog from '../AddBranchDialog';
import EditBranchDialog from '../EditBranchDialog';
import EditCompanyDialog from '../EditCompanyDialog';

export const CompanyDialogs: React.FC = () => {
  return (
    <>
      <AddBranchDialog />
      <EditBranchDialog />
      <EditCompanyDialog />
    </>
  );
};
