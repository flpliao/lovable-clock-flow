
import React, { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';

interface CompanyBranchPermissionGuardProps {
  children: ReactNode;
}

export const CompanyBranchPermissionGuard: React.FC<CompanyBranchPermissionGuardProps> = ({ children }) => {
  const { currentUser, isAdmin } = useUser();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
