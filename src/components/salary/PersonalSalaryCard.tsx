import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePersonalSalary } from '@/hooks/usePersonalSalary';
import { Salary } from '@/types/salary';
import { formatCurrency } from '@/utils/currencyUtils';
import { useEffect } from 'react';

interface PersonalSalaryCardProps {
  salary: Salary | null;
  isLoading?: boolean;
}

export default function PersonalSalaryCard({ salary, isLoading = false }: PersonalSalaryCardProps) {
  const { loadMySalaries } = usePersonalSalary();

  useEffect(() => {
    loadMySalaries();
  }, []);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!salary) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">無薪資資料</h3>
          <p className="text-gray-500">找不到薪資記錄</p>
        </CardContent>
      </Card>
    );
  }

  // 使用預計算的欄位
  const allowances = salary.allowances || 0;
  const deductions = salary.deductions || 0;
  const totalSalary = salary.totalSalary || 0;

  return (
    <div className="space-y-6">
      {/* 薪資摘要卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">基本薪資</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(salary.basic_salary || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">津貼</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(allowances)}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">扣除</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(deductions)}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">實領薪資</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalSalary)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 薪資明細表格 */}
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">薪資明細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-semibold">項目</TableHead>
                  <TableHead className="text-gray-700 font-semibold">金額</TableHead>
                  <TableHead className="text-gray-700 font-semibold">備註</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 基本薪資 */}
                <TableRow className="border-gray-100">
                  <TableCell className="font-medium text-gray-800">基本薪資</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {formatCurrency(salary.basic_salary || 0)}
                  </TableCell>
                  <TableCell className="text-gray-600">-</TableCell>
                </TableRow>

                {/* 津貼 */}
                {allowances > 0 && (
                  <TableRow className="border-gray-100">
                    <TableCell className="font-medium text-gray-800">津貼</TableCell>
                    <TableCell className="text-blue-600 font-semibold">
                      {formatCurrency(allowances)}
                    </TableCell>
                    <TableCell className="text-gray-600">-</TableCell>
                  </TableRow>
                )}

                {/* 扣除 */}
                {deductions > 0 && (
                  <TableRow className="border-gray-100">
                    <TableCell className="font-medium text-gray-800">扣除</TableCell>
                    <TableCell className="text-red-600 font-semibold">
                      -{formatCurrency(deductions)}
                    </TableCell>
                    <TableCell className="text-gray-600">-</TableCell>
                  </TableRow>
                )}

                {/* 實領薪資 */}
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableCell className="font-bold text-gray-800">實領薪資</TableCell>
                  <TableCell className="text-purple-600 font-bold text-lg">
                    {formatCurrency(totalSalary)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {salary.status === 'paid' ? '已發放' : '未發放'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
