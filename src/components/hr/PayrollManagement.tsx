
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Search, Filter, Calculator, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPayrollStatusText, getPayrollStatusColor, formatCurrency } from '@/utils/payrollUtils';

const PayrollManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current');

  // 模擬薪資資料
  const payrolls = [
    {
      id: '1',
      staff_name: '張小明',
      position: '軟體工程師',
      department: 'IT部',
      pay_period_start: '2024-01-01',
      pay_period_end: '2024-01-31',
      base_salary: 50000,
      overtime_pay: 5000,
      holiday_pay: 2000,
      allowances: 3000,
      gross_salary: 60000,
      tax: 3000,
      labor_insurance: 1000,
      health_insurance: 800,
      net_salary: 55200,
      status: 'calculated' as const
    },
    {
      id: '2',
      staff_name: '李小華',
      position: '業務經理',
      department: '業務部',
      pay_period_start: '2024-01-01',
      pay_period_end: '2024-01-31',
      base_salary: 60000,
      overtime_pay: 0,
      holiday_pay: 0,
      allowances: 5000,
      gross_salary: 65000,
      tax: 4000,
      labor_insurance: 1200,
      health_insurance: 1000,
      net_salary: 58800,
      status: 'approved' as const
    }
  ];

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = payroll.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          薪資管理
        </h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            批量計算
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增薪資記錄
          </Button>
        </div>
      </div>

      {/* 篩選控制項 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋員工姓名、職位或部門..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="calculated">已計算</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="paid">已發放</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="期間" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">本月</SelectItem>
                <SelectItem value="last">上月</SelectItem>
                <SelectItem value="quarter">本季</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* 薪資統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">總薪資支出</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(1380000)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已計算</p>
                <p className="text-2xl font-bold text-blue-600">15</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已核准</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已發放</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 薪資列表 */}
      <Card>
        <CardHeader>
          <CardTitle>薪資記錄</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>員工</TableHead>
                <TableHead>職位/部門</TableHead>
                <TableHead>薪資期間</TableHead>
                <TableHead>基本薪資</TableHead>
                <TableHead>加班費</TableHead>
                <TableHead>津貼</TableHead>
                <TableHead>總薪資</TableHead>
                <TableHead>扣除額</TableHead>
                <TableHead>實發薪資</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell className="font-medium">{payroll.staff_name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payroll.position}</div>
                      <div className="text-sm text-gray-500">{payroll.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {payroll.pay_period_start} ~ {payroll.pay_period_end}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(payroll.base_salary)}</TableCell>
                  <TableCell>{formatCurrency(payroll.overtime_pay)}</TableCell>
                  <TableCell>{formatCurrency(payroll.allowances)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payroll.gross_salary)}</TableCell>
                  <TableCell>
                    {formatCurrency(payroll.tax + payroll.labor_insurance + payroll.health_insurance)}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(payroll.net_salary)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPayrollStatusColor(payroll.status)}>
                      {getPayrollStatusText(payroll.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                      {payroll.status === 'calculated' && (
                        <Button variant="outline" size="sm" className="text-green-600">
                          核准
                        </Button>
                      )}
                      {payroll.status === 'approved' && (
                        <Button variant="outline" size="sm" className="text-purple-600">
                          發放
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPayrolls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              沒有找到相關的薪資記錄
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollManagement;
