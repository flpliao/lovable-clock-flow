import EmployeeManagement from '@/components/employee/EmployeeManagement';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { Users } from 'lucide-react';

const PersonnelManagement = () => {
  return (
    <PageLayout>
      <PageHeader
        icon={Users}
        title="人員管理"
        description="管理人員資料與組織架構"
        iconBgColor="bg-purple-500"
      />

      {/* 內容區域 */}
      <EmployeeManagement />
    </PageLayout>
  );
};

export default PersonnelManagement;
