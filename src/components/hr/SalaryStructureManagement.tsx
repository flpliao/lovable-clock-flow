
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/payrollUtils';

const SalaryStructureManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 模擬薪資結構資料
  const salaryStructures = [
    {
      id: '1',
      position: '軟體工程師',
      department: 'IT部',
      level: 2,
      base_salary: 50000,
      overtime_rate: 1.34,
      holiday_rate: 2.0,
      allowances: { transport: 2000, meal: 1000 },
      is_active: true,
      effective_date: '2024-01-01'
    },
    {
      id: '2',
      position: '業務經理',
      department: '業務部',
      level: 3,
      base_salary: 60000,
      overtime_rate: 1.34,
      holiday_rate: 2.0,
      allowances: { transport: 3000, meal: 1500, phone: 800 },
      is_active: true,
      effective_date: '2024-01-01'
    },
    {
      id: '3',
      position: '助理',
      department: '行政部',
      level: 1,
      base_salary: 28000,
      overtime_rate: 1.34,
      holiday_rate: 2.0,
      allowances: { transport: 1500, meal: 800 },
      is_active: true,
      effective_date: '2024-01-01'
    }
  ];

  const filteredStructures = salaryStructures.filter(structure => {
    const matchesSearch = structure.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const calculateTotalAllowances = (allowances: Record<string, number>): number => {
    return Object.values(allowances).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          薪資結構管理
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增薪資結構
        </Button>
      </div>

      {/* 搜尋控制項 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋職位或部門..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 薪資結構統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">活躍結構</p>
                <p className="text-2xl font-bold text-blue-600">{salaryStructures.filter(s => s.is_active).length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均薪資</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(salaryStructures.reduce((sum, s) => sum + s.base_salary, 0) / salaryStructures.length)}
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">最高薪資</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(Math.max(...salaryStructures.map(s => s.base_salary)))}
                </p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 薪資結構列表 */}
      <Card>
        <CardHeader>
          <CardTitle>薪資結構列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>職位</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>等級</TableHead>
                <TableHead>基本薪資</TableHead>
                <TableHead>加班費率</TableHead>
                <TableHead>假日費率</TableHead>
                <TableHead>津貼總額</TableHead>
                <TableHead>生效日期</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStructures.map((structure) => (
                <TableRow key={structure.id}>
                  <TableCell className="font-medium">{structure.position}</TableCell>
                  <TableCell>{structure.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Level {structure.level}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(structure.base_salary)}
                  </TableCell>
                  <TableCell>{structure.overtime_rate}x</TableCell>
                  <TableCell>{structure.holiday_rate}x</TableCell>
                  <TableCell>
                    {formatCurrency(calculateTotalAllowances(structure.allowances))}
                  </TableCell>
                  <TableCell>{structure.effective_date}</TableCell>
                  <TableCell>
                    <Badge className={structure.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {structure.is_active ? '啟用' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStructures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              沒有找到相關的薪資結構
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryStructureManagement;
