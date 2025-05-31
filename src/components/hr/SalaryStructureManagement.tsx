
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/payrollUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const SalaryStructureManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          薪資結構
        </h2>
        <Button size="sm" className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          新增
        </Button>
      </div>

      {/* 搜尋控制項 */}
      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜尋職位或部門..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* 薪資結構統計 */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600">活躍結構</p>
              <p className="text-lg font-bold text-blue-600">{salaryStructures.filter(s => s.is_active).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600">平均薪資</p>
              <p className="text-sm font-bold text-green-600">
                {formatCurrency(salaryStructures.reduce((sum, s) => sum + s.base_salary, 0) / salaryStructures.length)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600">最高薪資</p>
              <p className="text-sm font-bold text-purple-600">
                {formatCurrency(Math.max(...salaryStructures.map(s => s.base_salary)))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 薪資結構列表 */}
      {isMobile ? (
        <div>
          {filteredStructures.map((structure) => (
            <Card key={structure.id} className="mb-3">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-sm">{structure.position}</h3>
                    <p className="text-xs text-gray-500">{structure.department} · Level {structure.level}</p>
                  </div>
                  <Badge className={structure.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {structure.is_active ? '啟用' : '停用'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-500">基本薪資:</span>
                    <p className="font-medium">{formatCurrency(structure.base_salary)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">津貼總額:</span>
                    <p className="font-medium">{formatCurrency(calculateTotalAllowances(structure.allowances))}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    編輯
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 text-xs">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredStructures.length === 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500 text-sm">
                  沒有找到相關的薪資結構
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default SalaryStructureManagement;
