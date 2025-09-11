import PageLayout from '@/components/layouts/PageLayout';
import { useSalary } from '@/hooks/useSalary';
import useSalaryStore from '@/stores/salaryStore';
import { Salary } from '@/types/salary';
import { formatYearMonth } from '@/utils/dateUtils';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateSalaryForm from './CreateSalaryForm';
import SalaryTable from './SalaryTable';

const SalaryList: React.FC = () => {
  const { yearMonth } = useParams<{ yearMonth: string }>();
  const navigate = useNavigate();
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);

  // 直接從 store 取用需要的狀態
  const salaries = useSalaryStore(state => state.salaries);
  const salariesLoading = useSalaryStore(state => state.salariesLoading);

  // 只取用需要的函數
  const { loadSalariesByMonth, handleUpdateSalary, handleDeleteSalary } = useSalary();

  // 載入特定月份的薪資資料
  useEffect(() => {
    if (yearMonth) {
      loadSalariesByMonth(yearMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearMonth]);

  // 返回薪資管理頁面
  const handleBackToSalaryManagement = () => {
    navigate('/salary-management');
  };

  const handleUpdateSalarySubmit = async (salaryData: Salary) => {
    if (editingSalary) {
      await handleUpdateSalary(editingSalary.slug, salaryData);
      setEditingSalary(null);
      // 重新載入當前月份的薪資資料
      if (yearMonth) {
        loadSalariesByMonth(yearMonth);
      }
    }
  };

  const handleEditSalary = (salary: Salary) => {
    setEditingSalary(salary);
  };

  const handleDeleteSalarySubmit = async (slug: string) => {
    if (confirm('確定要刪除這筆薪資記錄嗎？')) {
      await handleDeleteSalary(slug);
      // 重新載入當前月份的薪資資料
      if (yearMonth) {
        loadSalariesByMonth(yearMonth);
      }
    }
  };

  return (
    <PageLayout>
      <div className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="space-y-6">
          {/* 薪資記錄列表視圖 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToSalaryManagement}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  title="返回薪資管理"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <h3 className="text-lg font-semibold text-white drop-shadow-md">
                  薪資記錄列表 - {yearMonth ? formatYearMonth(yearMonth) : ''}
                </h3>
              </div>
              <div className="flex gap-2">{/* 移除匯出按鈕 */}</div>
            </div>
            <SalaryTable
              salaries={salaries}
              isLoading={salariesLoading}
              onEdit={handleEditSalary}
              onDelete={handleDeleteSalarySubmit}
            />
          </div>

          <CreateSalaryForm
            open={!!editingSalary}
            onOpenChange={open => !open && setEditingSalary(null)}
            onSubmit={handleUpdateSalarySubmit}
            initialData={editingSalary}
            title="編輯薪資記錄"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default SalaryList;
