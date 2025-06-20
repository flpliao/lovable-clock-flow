
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const DepartmentManagement = () => {
  const { currentUser } = useUser();
  
  // 部門管理功能已整合到公司管理頁面
  console.log('🔄 部門管理功能已移至公司管理頁面，重定向中...');
  
  // 重定向到公司管理頁面
  return <Navigate to="/company-branch-management" replace />;
};

export default DepartmentManagement;
