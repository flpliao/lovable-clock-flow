import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface CompanyBranchPermissionGuardProps {
  children: ReactNode;
}

export const CompanyBranchPermissionGuard: React.FC<CompanyBranchPermissionGuardProps> = ({ children }) => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
