import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import PersonalSalaryMonthList from '@/components/salary/PersonalSalaryMonthList';
import { DollarSign } from 'lucide-react';

const PersonalSalary = () => {
  return (
    <PageLayout>
      <PageHeader
        icon={DollarSign}
        title="我的薪資"
        description="查看個人薪資記錄與明細"
        iconBgColor="bg-green-500"
      />

      <div className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6">
        <PersonalSalaryMonthList />
      </div>
    </PageLayout>
  );
};

export default PersonalSalary;
