import DeleteDialog from '@/components/common/dialogs/DeleteConfirmDialog';
import PageLayout from '@/components/layouts/PageLayout';
import { useSalary } from '@/hooks/useSalary';
import useSalaryStore from '@/stores/salaryStore';
import { Salary, SalaryStatus } from '@/types/salary';
import { formatYearMonth } from '@/utils/dateUtils';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateSalaryForm from './CreateSalaryForm';
import EditSalaryForm from './EditSalaryForm';
import SalaryTable from './SalaryTable';

const SalaryList: React.FC = () => {
  const { yearMonth } = useParams<{ yearMonth: string }>();
  const navigate = useNavigate();
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [salaryToDelete, setSalaryToDelete] = useState<string | null>(null);

  // 批量發布相關狀態
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedSalaries, setSelectedSalaries] = useState<Set<string>>(new Set());

  // 直接從 store 取用需要的狀態
  const salaries = useSalaryStore(state => state.salaries);
  const salariesLoading = useSalaryStore(state => state.salariesLoading);

  // 只取用需要的函數
  const {
    loadSalariesByMonth,
    handleCreateSalary,
    handleUpdateSalary,
    handleDeleteSalary,
    handleBatchPublishSalaries,
  } = useSalary();

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

  const handleEditSalary = (salary: Salary) => {
    setEditingSalary(salary);
  };

  const handleDeleteSalaryConfirm = (slug: string) => {
    setSalaryToDelete(slug);
    setShowDeleteDialog(true);
  };

  // 批量發布功能
  const handleBatchPublish = async () => {
    if (selectedSalaries.size === 0) return;

    const salarySlugs = Array.from(selectedSalaries);
    await handleBatchPublishSalaries(salarySlugs);

    // 清除選擇狀態
    setSelectedSalaries(new Set());
    setIsBatchMode(false);

    // 重新載入當前月份的薪資資料
    if (yearMonth) {
      loadSalariesByMonth(yearMonth);
    }
  };

  // 切換批量模式
  const toggleBatchMode = () => {
    setIsBatchMode(!isBatchMode);
    setSelectedSalaries(new Set());
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    const draftSalaries = salaries.filter(salary => salary.status === SalaryStatus.DRAFT);
    if (selectedSalaries.size === draftSalaries.length) {
      setSelectedSalaries(new Set());
    } else {
      setSelectedSalaries(new Set(draftSalaries.map(salary => salary.slug)));
    }
  };

  // 切換單個選擇
  const toggleSelectSalary = (slug: string) => {
    const newSelected = new Set(selectedSalaries);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedSalaries(newSelected);
  };

  return (
    <PageLayout>
      <div className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="space-y-6">
          {/* 薪資記錄列表視圖 */}
          <div className="space-y-4">
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

            <SalaryTable
              salaries={salaries}
              isLoading={salariesLoading}
              onEdit={handleEditSalary}
              onDelete={handleDeleteSalaryConfirm}
              yearMonth={yearMonth}
              onAdd={() => setShowCreateDialog(true)}
              isBatchMode={isBatchMode}
              selectedSalaries={selectedSalaries}
              onToggleSelect={toggleSelectSalary}
              onToggleBatchMode={toggleBatchMode}
              onToggleSelectAll={toggleSelectAll}
              onBatchPublish={handleBatchPublish}
            />
          </div>

          {/* 新增薪資表單 */}
          <CreateSalaryForm
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSubmit={handleCreateSalary}
            yearMonth={yearMonth}
          />

          {/* 編輯薪資表單 */}
          {editingSalary && (
            <EditSalaryForm
              open={!!editingSalary}
              onOpenChange={open => !open && setEditingSalary(null)}
              onSubmit={() => handleUpdateSalary(editingSalary.slug, editingSalary)}
              salary={editingSalary}
            />
          )}

          {/* 刪除確認對話框 */}
          <DeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={() => handleDeleteSalary(salaryToDelete)}
            onSuccess={() => setSalaryToDelete(null)}
            title="確認刪除薪資記錄"
            description={`確定要刪除 ${salaries.find(s => s.slug === salaryToDelete)?.employee_name || '此員工'} 的薪資記錄嗎？此操作無法復原。`}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default SalaryList;
