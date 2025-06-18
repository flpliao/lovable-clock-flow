
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/payrollUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import SalaryStructureFormDialog from './salary/SalaryStructureFormDialog';
import SalaryStructureQuickAddDialog from './salary/SalaryStructureQuickAddDialog';
import { Skeleton } from '@/components/ui/skeleton';

const SalaryStructureManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuickAddDialog, setShowQuickAddDialog] = useState(false);
  const [editingStructure, setEditingStructure] = useState<any>(null);
  const isMobile = useIsMobile();

  const {
    salaryStructures,
    isLoading,
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
    refresh
  } = usePayrollManagement();

  const filteredStructures = salaryStructures.filter(structure => {
    const matchesSearch = structure.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const calculateTotalAllowances = (allowances: Record<string, number>): number => {
    return Object.values(allowances || {}).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
  };

  const handleCreateStructure = async (structureData: any) => {
    await createSalaryStructure(structureData);
    setShowCreateDialog(false);
  };

  const handleQuickAddStructure = async (structureData: any) => {
    await createSalaryStructure(structureData);
    setShowQuickAddDialog(false);
  };

  const handleUpdateStructure = async (structureData: any) => {
    if (editingStructure) {
      await updateSalaryStructure(editingStructure.id, structureData);
      setEditingStructure(null);
    }
  };

  const handleEditStructure = (structure: any) => {
    setEditingStructure(structure);
  };

  const handleDeleteStructure = async (id: string) => {
    if (confirm('確定要刪除這個薪資結構嗎？')) {
      await deleteSalaryStructure(id);
    }
  };

  if (isLoading && salaryStructures.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-white/20" />
          <Skeleton className="h-8 w-16 bg-white/20" />
        </div>
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
          <Skeleton className="h-9 w-full bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
              <Skeleton className="h-16 w-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Settings className="h-4 w-4 mr-2 text-white" />
          薪資結構
        </h2>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
            onClick={() => setShowQuickAddDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            快速新增
          </Button>
          <Button 
            size="sm" 
            className="text-xs bg-blue-500/70 hover:bg-blue-600/70 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            完整新增
          </Button>
        </div>
      </div>

      {/* 搜尋控制項 */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="搜尋職位或部門..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* 薪資結構統計 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-white/80">活躍結構</p>
            <p className="text-lg font-bold text-white">
              {salaryStructures.filter(s => s.is_active).length}
            </p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-white/80">平均薪資</p>
            <p className="text-sm font-bold text-white">
              {salaryStructures.length > 0 
                ? formatCurrency(salaryStructures.reduce((sum, s) => sum + s.base_salary, 0) / salaryStructures.length)
                : formatCurrency(0)
              }
            </p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-white/80">最高薪資</p>
            <p className="text-sm font-bold text-white">
              {salaryStructures.length > 0 
                ? formatCurrency(Math.max(...salaryStructures.map(s => s.base_salary)))
                : formatCurrency(0)
              }
            </p>
          </div>
        </div>
      </div>

      {/* 薪資結構列表 */}
      {isMobile ? (
        <div>
          {filteredStructures.map((structure) => (
            <div key={structure.id} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 mb-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm text-white">{structure.position}</h3>
                  <p className="text-xs text-white/70">{structure.department} · Level {structure.level}</p>
                </div>
                <Badge className={structure.is_active ? 'bg-green-500/20 text-green-100 border-green-400/30' : 'bg-gray-500/20 text-gray-100 border-gray-400/30'}>
                  {structure.is_active ? '啟用' : '停用'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-white/70">基本薪資:</span>
                  <p className="font-medium text-white">{formatCurrency(structure.base_salary)}</p>
                </div>
                <div>
                  <span className="text-white/70">津貼總額:</span>
                  <p className="font-medium text-white">{formatCurrency(calculateTotalAllowances(structure.allowances))}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs bg-white/20 border-white/30 text-white hover:bg-white/30" 
                  onClick={() => handleEditStructure(structure)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  編輯
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-300 text-xs bg-red-500/20 border-red-400/30 hover:bg-red-500/30" 
                  onClick={() => handleDeleteStructure(structure.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {filteredStructures.length === 0 && (
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
              <div className="text-center text-white/70 text-sm">
                沒有找到相關的薪資結構
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/10">
                <TableHead className="text-white/90">職位</TableHead>
                <TableHead className="text-white/90">部門</TableHead>
                <TableHead className="text-white/90">等級</TableHead>
                <TableHead className="text-white/90">基本薪資</TableHead>
                <TableHead className="text-white/90">加班費率</TableHead>
                <TableHead className="text-white/90">假日費率</TableHead>
                <TableHead className="text-white/90">津貼總額</TableHead>
                <TableHead className="text-white/90">生效日期</TableHead>
                <TableHead className="text-white/90">狀態</TableHead>
                <TableHead className="text-white/90">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStructures.map((structure) => (
                <TableRow key={structure.id} className="border-white/20 hover:bg-white/10">
                  <TableCell className="font-medium text-white">{structure.position}</TableCell>
                  <TableCell className="text-white/90">{structure.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/30 text-white/90">Level {structure.level}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {formatCurrency(structure.base_salary)}
                  </TableCell>
                  <TableCell className="text-white/90">{structure.overtime_rate}x</TableCell>
                  <TableCell className="text-white/90">{structure.holiday_rate}x</TableCell>
                  <TableCell className="text-white/90">
                    {formatCurrency(calculateTotalAllowances(structure.allowances))}
                  </TableCell>
                  <TableCell className="text-white/90">{structure.effective_date}</TableCell>
                  <TableCell>
                    <Badge className={structure.is_active ? 'bg-green-500/20 text-green-100 border-green-400/30' : 'bg-gray-500/20 text-gray-100 border-gray-400/30'}>
                      {structure.is_active ? '啟用' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => handleEditStructure(structure)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-300 bg-red-500/20 border-red-400/30 hover:bg-red-500/30" 
                        onClick={() => handleDeleteStructure(structure.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStructures.length === 0 && (
            <div className="text-center py-8 text-white/70">
              沒有找到相關的薪資結構
            </div>
          )}
        </div>
      )}

      <SalaryStructureFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateStructure}
        title="新增薪資結構"
      />

      <SalaryStructureQuickAddDialog
        open={showQuickAddDialog}
        onOpenChange={setShowQuickAddDialog}
        onSubmit={handleQuickAddStructure}
        title="快速新增薪資結構"
      />

      <SalaryStructureFormDialog
        open={!!editingStructure}
        onOpenChange={(open) => !open && setEditingStructure(null)}
        onSubmit={handleUpdateStructure}
        initialData={editingStructure}
        title="編輯薪資結構"
      />
    </div>
  );
};

export default SalaryStructureManagement;
