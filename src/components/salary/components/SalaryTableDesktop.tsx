import { EmptyState } from '@/components/common/EmptyState';
import SalaryTableActions from '@/components/salary/components/SalaryTableActions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Salary, SalaryStatus } from '@/types/salary';
import { formatYearMonth } from '@/utils/dateUtils';
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

interface SalaryTableDesktopProps {
  salaries: Salary[];
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
  yearMonth?: string;
}

const SalaryTableDesktop: React.FC<SalaryTableDesktopProps> = ({
  salaries,
  onEdit,
  onDelete,
  yearMonth,
}) => {
  return (
    <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-white/60 border-b border-white/30 pb-4">
        <CardTitle className="text-slate-800 text-xl font-bold">
          薪資記錄列表{yearMonth ? ` - ${formatYearMonth(yearMonth)}` : ''}
        </CardTitle>
        <CardDescription className="text-slate-600 font-medium">
          {yearMonth ? `${formatYearMonth(yearMonth)} 的員工薪資記錄` : '管理系統中的所有薪資記錄'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-white/30 hover:bg-white/20 transition-colors">
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                    員工編號
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">
                    員工
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">
                    單位/職位
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                    基本薪資
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                    薪資類型
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                    狀態
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaries.map(salary => (
                  <TableRow
                    key={salary.slug}
                    className="border-white/30 hover:bg-white/40 transition-all duration-200"
                  >
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{salary.employee_number}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 py-3 px-4 whitespace-nowrap">
                      <span
                        className="truncate block max-w-[120px]"
                        title={salary.employee_name || '未知員工'}
                      >
                        {salary.employee_name || '未知員工'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-800">{salary.department}</div>
                        <div className="text-sm text-slate-600">{salary.position}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 py-3 px-4 whitespace-nowrap">
                      {formatCurrency(salary.basic_salary)}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-medium px-2 py-1 rounded-lg">
                        {salary.salary_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        className={cn(
                          `font-medium px-2 py-1 rounded-lg`,
                          getStatusDisplay(salary.status).className
                        )}
                      >
                        {getStatusDisplay(salary.status).text}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <SalaryTableActions salary={salary} onEdit={onEdit} onDelete={onDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <EmptyState data={salaries} message="沒有找到相關的薪資記錄" />
      </CardContent>
    </Card>
  );
};

export default SalaryTableDesktop;
