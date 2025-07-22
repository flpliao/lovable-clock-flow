import { ROUTES } from '@/routes';
import useEmployeeStore from '@/stores/employeeStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useEmployeeStore(state => state.isAuthenticated);

  // 只有在認證系統完全初始化且用戶資料載入完成後，才進行認證檢查
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
