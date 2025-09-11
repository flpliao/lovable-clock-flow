import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { CalendarList } from '@/pages/calendar/CalendarList';
import { Calendar } from 'lucide-react';

const HolidayManagement = () => {
  return (
    <PageLayout>
      <PageHeader
        icon={Calendar}
        title="假日行事曆"
        description="管理法定假日與工作日設定"
        iconBgColor="bg-white/20"
      />
      <CalendarList />
    </PageLayout>
  );
};

export default HolidayManagement;
