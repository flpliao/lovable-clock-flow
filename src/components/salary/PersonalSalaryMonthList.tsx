import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePersonalSalary } from '@/hooks/usePersonalSalary';
import { formatCurrency } from '@/utils/currencyUtils';
import { formatYearMonth } from '@/utils/dateUtils';
import { Calendar, Eye } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PersonalSalaryMonthList() {
  const { personalSalaries, salariesLoading, loadMySalaries } = usePersonalSalary();
  const navigate = useNavigate();

  // 載入個人薪資記錄
  useEffect(() => {
    loadMySalaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依賴陣列確保只執行一次

  // 從薪資記錄中提取唯一的月份
  const salaryMonths = useMemo(() => {
    const months = personalSalaries.map(salary => salary.salary_month);
    return [...new Set(months)].sort().reverse(); // 去重並按時間倒序排列
  }, [personalSalaries]);

  // 處理月份點擊，導航到個人薪資明細頁面
  const handleMonthClick = (month: string) => {
    navigate(`/personal-salary/${month}`);
  };

  if (salariesLoading) {
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
      {salaryMonths.length === 0 ? (
        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">尚無薪資記錄</h3>
            <p className="text-gray-500">還沒有任何月份的薪資資料</p>
          </CardContent>
        </Card>
      ) : (
        salaryMonths.map(month => {
          // 找到該月份的薪資記錄（單筆）
          const salary = personalSalaries.find(salary => salary.salary_month === month);
          const totalSalary = salary?.totalSalary || 0;

          return (
            <div
              key={month}
              className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-lg hover:shadow-lg transition-all duration-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleMonthClick(month)}
                >
                  <div className="p-1.5 bg-green-500/70 rounded-lg shadow-sm">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-800 text-base font-semibold">
                      {formatYearMonth(month)}
                    </h3>
                    <p className="text-slate-600 text-sm">個人薪資記錄</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(totalSalary)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleMonthClick(month)}
                    className="text-blue-600 bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200"
                    title={`查看 ${formatYearMonth(month)} 薪資明細`}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    查看明細
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
