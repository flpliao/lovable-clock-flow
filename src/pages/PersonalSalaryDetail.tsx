import PageLayout from '@/components/layouts/PageLayout';
import PersonalSalaryCard from '@/components/salary/PersonalSalaryCard';
import { usePersonalSalary } from '@/hooks/usePersonalSalary';
import { formatYearMonth } from '@/utils/dateUtils';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PersonalSalaryDetail = () => {
  const { yearMonth } = useParams<{ yearMonth: string }>();
  const navigate = useNavigate();
  const { personalSalaries, salariesLoading } = usePersonalSalary();

  // 找到特定月份的薪資記錄
  const salary = useMemo(() => {
    if (!yearMonth || !personalSalaries.length) {
      return null;
    }
    return personalSalaries.find(salary => salary.salary_month === yearMonth) || null;
  }, [personalSalaries, yearMonth]);

  // 返回個人薪資頁面
  const handleBackToPersonalSalary = () => {
    navigate('/personal-salary');
  };

  return (
    <PageLayout>
      <div className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="space-y-6">
          {/* 薪資明細標題 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToPersonalSalary}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              title="返回我的薪資"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">
              薪資明細 - {yearMonth ? formatYearMonth(yearMonth) : ''}
            </h3>
          </div>

          {/* 顯示該月份的薪資記錄 */}
          <PersonalSalaryCard salary={salary} isLoading={salariesLoading} />
        </div>
      </div>
    </PageLayout>
  );
};

export default PersonalSalaryDetail;
