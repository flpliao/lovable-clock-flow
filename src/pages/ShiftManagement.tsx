import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import ShiftList from '@/components/shift/ShiftList';
import { Clock } from 'lucide-react';

const ShiftManagement = () => {
  return (
    <PageLayout>
      <PageHeader
        icon={Clock}
        title="班次規劃"
        description="管理員工工作班次設定"
        iconBgColor="bg-purple-500"
      />

      {/* 班次列表 */}
      <ShiftList />
    </PageLayout>
  );
};

export default ShiftManagement;
