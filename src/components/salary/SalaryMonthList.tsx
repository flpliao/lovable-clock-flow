import { AddButton, ExportButton, ImportButton } from '@/components/common/buttons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSalary } from '@/hooks/useSalary';
import { routes } from '@/routes/api';
import useSalaryStore from '@/stores/salaryStore';
import { formatYearMonth } from '@/utils/dateUtils';
import { Calendar, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddMonthDialog from './dialogs/AddMonthDialog';

export default function SalaryMonthList() {
  const {
    salaryMonths,
    monthsLoading,
    loadSalaryMonths,
    handleImportSalary,
    handleExportSalary,
    handleDownloadTemplate,
  } = useSalary();
  const navigate = useNavigate();
  const [showAddMonthDialog, setShowAddMonthDialog] = useState(false);
  const { addSalaryMonths } = useSalaryStore();

  // 載入月份列表（只執行一次）
  useEffect(() => {
    loadSalaryMonths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依賴陣列確保只執行一次

  // 處理月份點擊，導航到薪資列表頁面
  const handleMonthClick = (month: string) => {
    navigate(`${routes.salaryByMonth.replace(':yearMonth', month)}`);
  };

  // 匯入功能
  const handleImport = async () => {
    // 創建文件輸入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImportSalary(file);
        // 匯入成功後重新載入月份列表
        loadSalaryMonths();
      }
    };
    input.click();
  };

  // 匯出功能
  const handleExport = async (month: string) => {
    await handleExportSalary({
      salary_month: month,
    });
  };

  // 新增月份功能
  const handleAddMonth = () => {
    setShowAddMonthDialog(true);
  };

  // 確認新增月份
  const handleConfirmAddMonth = (data: { month: string }) => {
    navigate(`${routes.salaryByMonth.replace(':yearMonth', data.month)}`);
    addSalaryMonths([data.month]);
  };

  if (monthsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl"
          >
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 操作按鈕 */}
      <div className="flex justify-end gap-2">
        <AddButton size="sm" onClick={handleAddMonth} buttonText="新增月份" />
        <ExportButton
          size="sm"
          onClick={handleDownloadTemplate}
          className="text-purple-600 bg-purple-100 hover:bg-purple-200 border border-purple-300 hover:border-purple-400 shadow-sm hover:shadow-md transition-all duration-200"
        >
          下載範本
        </ExportButton>
        <ImportButton size="sm" onClick={handleImport} />
      </div>

      {salaryMonths.length === 0 ? (
        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">尚無薪資記錄</h3>
            <p className="text-gray-500">還沒有任何月份的薪資資料</p>
          </CardContent>
        </Card>
      ) : (
        salaryMonths.map(month => (
          <div
            key={month}
            className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-lg hover:shadow-lg transition-all duration-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => handleMonthClick(month)}
              >
                <div className="p-1.5 bg-blue-500/70 rounded-lg shadow-sm">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-800 text-base font-semibold">
                    {formatYearMonth(month)}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ExportButton
                  size="sm"
                  className="text-green-600 bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => handleExport(month)}
                />
                <Button
                  size="sm"
                  onClick={() => handleMonthClick(month)}
                  className="text-blue-600 bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200"
                  title={`查看 ${formatYearMonth(month)} 薪資記錄`}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  查看
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* 新增月份對話框 */}
      <AddMonthDialog
        open={showAddMonthDialog}
        onOpenChange={setShowAddMonthDialog}
        onSubmit={handleConfirmAddMonth}
      />
    </div>
  );
}
