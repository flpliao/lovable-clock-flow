import { Navigate } from 'react-router-dom';

const DepartmentManagement = () => {
  // 重定向到公司管理頁面
  return <Navigate to="/company-branch-management" replace />;
};

export default DepartmentManagement;
