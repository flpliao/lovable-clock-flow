import { AddButton, EditButton } from '@/components/common/buttons';
import DeleteButton from '@/components/common/buttons/DeleteButton';
import { EmptyState } from '@/components/common/EmptyState';
import BatchActionButtons from '@/components/salary/components/BatchActionButtons';
import SalaryTableLoading from '@/components/salary/components/SalaryTableLoading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { CheckSquare, Edit, Trash2 } from 'lucide-react';
import React from 'react';

interface SalaryTableProps {
  salaries: Salary[];
  isLoading: boolean;
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
  yearMonth?: string;
  onAdd?: () => void;
  isBatchMode?: boolean;
  selectedSalaries?: Set<string>;
  onToggleSelect?: (slug: string) => void;
  onToggleBatchMode?: () => void;
  onToggleSelectAll?: () => void;
  onBatchPublish?: () => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
  salaries,
  isLoading,
  onEdit,
  onDelete,
  yearMonth,
  onAdd,
  isBatchMode = false,
  selectedSalaries = new Set(),
  onToggleSelect,
  onToggleBatchMode,
  onToggleSelectAll,
  onBatchPublish,
}) => {
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

  if (isLoading) {
    return <SalaryTableLoading />;
  }

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-white/60 border-b border-white/30 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-shrink-0">
              <CardTitle className="text-slate-800 text-xl font-bold">
                薪資記錄列表{yearMonth ? ` - ${formatYearMonth(yearMonth)}` : ''}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                {yearMonth
                  ? `${formatYearMonth(yearMonth)} 的員工薪資記錄`
                  : '管理系統中的所有薪資記錄'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Header 按鈕區域 */}
              {isBatchMode ? (
                <BatchActionButtons
                  isBatchMode={isBatchMode}
                  selectedSalaries={selectedSalaries}
                  salaries={salaries}
                  onToggleSelectAll={onToggleSelectAll}
                  onBatchPublish={onBatchPublish}
                  onToggleBatchMode={onToggleBatchMode}
                />
              ) : (
                <>
                  {onAdd && <AddButton onClick={onAdd} size="sm" buttonText="新增薪資記錄" />}
                  <Button
                    onClick={onToggleBatchMode}
                    size="sm"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <CheckSquare className="h-4 w-4" />
                    批量發布
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/30 hover:bg-white/20 transition-colors">
                    {isBatchMode && (
                      <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[50px] whitespace-nowrap text-center">
                        選擇
                      </TableHead>
                    )}
                    <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">
                      員工代碼
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
                    <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">
                      狀態/操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaries.map(salary => (
                    <TableRow
                      key={salary.slug}
                      className="border-white/30 hover:bg-white/40 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        if (isBatchMode && salary.status === SalaryStatus.DRAFT) {
                          onToggleSelect?.(salary.slug);
                        }
                      }}
                    >
                      {isBatchMode && (
                        <TableCell className="py-3 px-4 whitespace-nowrap text-center [&:has([role=checkbox])]:pr-4">
                          {salary.status === SalaryStatus.DRAFT ? (
                            <Checkbox
                              checked={selectedSalaries.has(salary.slug)}
                              onCheckedChange={() => onToggleSelect?.(salary.slug)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          ) : (
                            <div className="w-4 h-4"></div>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-slate-800">{salary.employee.slug}</div>
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
                        {salary.status === SalaryStatus.DRAFT ? (
                          <div className="flex gap-2">
                            <EditButton
                              size="sm"
                              onClick={() => onEdit(salary)}
                              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground text-black"
                            >
                              <Edit className="h-4 w-4" />
                            </EditButton>
                            <DeleteButton
                              size="sm"
                              className="text-red-600"
                              onClick={() => onDelete(salary.slug)}
                              disabled={isBatchMode}
                            >
                              <Trash2 className="h-4 w-4" />
                            </DeleteButton>
                          </div>
                        ) : (
                          <Badge
                            className={cn(
                              `font-medium px-2 py-1 rounded-lg`,
                              getStatusDisplay(salary.status).className
                            )}
                          >
                            {getStatusDisplay(salary.status).text}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <EmptyState data={salaries} message="沒有找到相關的薪資記錄" />
          </div>
        </CardContent>

        {/* Table Footer */}
        <div className="bg-white/40 border-t border-white/30 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-slate-600">
              {isBatchMode ? (
                <>
                  已選擇{' '}
                  <span className="font-semibold text-blue-600">{selectedSalaries.size}</span>{' '}
                  筆草稿記錄
                  {selectedSalaries.size > 0 && (
                    <span className="ml-2 text-green-600">• 可進行批量發布</span>
                  )}
                </>
              ) : (
                `共 ${salaries.length} 筆薪資記錄`
              )}
            </div>

            {isBatchMode && (
              <div className="flex items-center gap-2">
                <BatchActionButtons
                  isBatchMode={isBatchMode}
                  selectedSalaries={selectedSalaries}
                  salaries={salaries}
                  onToggleSelectAll={onToggleSelectAll}
                  onBatchPublish={onBatchPublish}
                  onToggleBatchMode={onToggleBatchMode}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default SalaryTable;
