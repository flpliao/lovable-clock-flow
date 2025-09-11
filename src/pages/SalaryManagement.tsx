import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import SalaryMonthList from '@/components/salary/SalaryMonthList';
import { DollarSign } from 'lucide-react';

const SalaryManagement = () => {
  return (
    <PageLayout>
      <PageHeader
        icon={DollarSign}
        title="薪資管理"
        description="管理員工薪資與薪資結構設定"
        iconBgColor="bg-green-500"
      />

      <div className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6">
        <SalaryMonthList />
      </div>
    </PageLayout>
  );
};

export default SalaryManagement;
