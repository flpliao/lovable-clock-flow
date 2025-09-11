import SalaryTableActions from '@/components/salary/components/SalaryTableActions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Salary, SalaryStatus } from '@/types/salary';
import { formatCurrency } from '@/utils/payrollUtils';
import React from 'react';

// 狀態顯示函數
const getStatusDisplay = (status: SalaryStatus) => {
  switch (status) {
    case SalaryStatus.DRAFT:
      return {
        text: '草稿',
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      };
    case SalaryStatus.PUBLISHED:
      return {
        text: '已發布',
        className: 'bg-green-100 text-green-800 border border-green-200',
      };
    case SalaryStatus.PAID:
      return {
        text: '已發放',
        className: 'bg-gray-100 text-gray-800 border border-gray-200',
      };
    default:
      return {
        text: '未知',
        className: 'bg-gray-100 text-gray-800 border border-gray-200',
      };
  }
};

interface SalaryTableMobileProps {
  salaries: Salary[];
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
  isBatchMode?: boolean;
  selectedSalaries?: Set<string>;
  onToggleSelect?: (slug: string) => void;
}

const SalaryTableMobile: React.FC<SalaryTableMobileProps> = ({
  salaries,
  onEdit,
  onDelete,
  isBatchMode = false,
  selectedSalaries = new Set(),
  onToggleSelect,
}) => {
  if (salaries.length === 0) {
    return (
      <div className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl p-6">
        <div className="text-center text-slate-600">
          <p className="text-lg font-medium">沒有找到相關的薪資記錄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {salaries.map(salary => (
        <div
          key={salary.slug}
          className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl p-4"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isBatchMode && (
                  <div className="mb-3">
                    {salary.status === SalaryStatus.DRAFT ? (
                      <Checkbox
                        checked={selectedSalaries.has(salary.slug)}
                        onCheckedChange={() => onToggleSelect?.(salary.slug)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    ) : (
                      <div className="w-4 h-4"></div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-slate-800 text-lg">
                  {salary.employee_name || '未知員工'}
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  {salary.position} · {salary.department}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-medium px-2 py-1 rounded-lg shadow-md">
                {salary.salary_type}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="bg-white/30 rounded-lg p-3">
                <span className="text-slate-600 font-medium block mb-1">基本薪資</span>
                <p className="font-bold text-emerald-700 text-lg">
                  {formatCurrency(salary.basic_salary)}
                </p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 border border-white/20">
              {salary.status === SalaryStatus.DRAFT ? (
                <SalaryTableActions
                  salary={salary}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  disabled={isBatchMode}
                />
              ) : (
                <div className="flex justify-center">
                  <Badge
                    className={cn(
                      `font-medium px-2 py-1 rounded-lg`,
                      getStatusDisplay(salary.status).className
                    )}
                  >
                    {getStatusDisplay(salary.status).text}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryTableMobile;
