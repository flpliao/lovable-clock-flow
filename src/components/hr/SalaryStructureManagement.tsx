import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/payrollUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import SalaryStructureFormDialog from './salary/SalaryStructureFormDialog';
import SalaryStructureQuickAddDialog from './salary/SalaryStructureQuickAddDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { SalaryStructure } from '@/types/hr';

// 薪資結構 API 篩選服務
class SalaryStructureApiFilterService {
  async filter(request: {
    conditionGroups: FilterGroup[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: SalaryStructure[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用本地篩選作為示範
      const { usePayrollManagement } = await import('@/hooks/usePayrollManagement');
      // 注意：這裡需要從實際的資料來源獲取資料
      // 由於 usePayrollManagement 是 Hook，我們需要其他方式獲取資料

      // 暫時返回空資料，實際實作時需要從 API 獲取
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('篩選薪資結構失敗:', error);
      throw error;
    }
  }

  // 獲取職級選項
  getLevelOptions() {
    return [
      { value: '1', label: '職級 1' },
      { value: '2', label: '職級 2' },
      { value: '3', label: '職級 3' },
      { value: '4', label: '職級 4' },
      { value: '5', label: '職級 5' },
      { value: '6', label: '職級 6' },
      { value: '7', label: '職級 7' },
      { value: '8', label: '職級 8' },
      { value: '9', label: '職級 9' },
      { value: '10', label: '職級 10' },
    ];
  }

  // 獲取狀態選項
  getStatusOptions() {
    return [
      { value: '啟用', label: '啟用' },
      { value: '停用', label: '停用' },
    ];
  }

  // 獲取部門選項（這裡可以從 API 獲取）
  getDepartmentOptions() {
    return [
      { value: 'IT', label: '資訊技術部' },
      { value: 'HR', label: '人力資源部' },
      { value: 'Finance', label: '財務部' },
      { value: 'Marketing', label: '行銷部' },
      { value: 'Sales', label: '業務部' },
      { value: 'Operations', label: '營運部' },
    ];
  }
}

const salaryStructureApiFilterService = new SalaryStructureApiFilterService();

const SalaryStructureManagement: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuickAddDialog, setShowQuickAddDialog] = useState(false);
  const [editingStructure, setEditingStructure] = useState<SalaryStructure | null>(null);
  const isMobile = useIsMobile();

  const {
    salaryStructures,
    isLoading,
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
    refresh,
  } = usePayrollManagement();

  // 定義搜尋欄位（包含下拉選單配置）
  const SEARCH_FIELDS: SearchField[] = useMemo(
    () => [
      {
        value: 'position',
        label: '職位名稱',
        type: 'input',
        placeholder: '請輸入職位名稱',
      },
      {
        value: 'department',
        label: '部門',
        type: 'select',
        options: salaryStructureApiFilterService.getDepartmentOptions(),
        placeholder: '請選擇部門',
      },
      {
        value: 'level',
        label: '職級',
        type: 'select',
        options: salaryStructureApiFilterService.getLevelOptions(),
        placeholder: '請選擇職級',
      },
      {
        value: 'base_salary',
        label: '基本薪資',
        type: 'input',
        placeholder: '請輸入薪資金額',
      },
      {
        value: 'effective_date',
        label: '生效日期',
        type: 'input',
        placeholder: '請輸入日期 (YYYY-MM-DD)',
      },
      {
        value: 'is_active',
        label: '狀態',
        type: 'select',
        options: salaryStructureApiFilterService.getStatusOptions(),
        placeholder: '請選擇狀態',
      },
    ],
    []
  );

  // 使用通用篩選 Hook（API 模式）
  const {
    conditionGroups,
    filteredData: filteredStructures,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
    loading: filterLoading,
  } = useAdvancedFilter({
    data: salaryStructures,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: () => true, // API 模式下不需要本地篩選
    apiService: salaryStructureApiFilterService,
  });

  const calculateTotalAllowances = (allowances: Record<string, number>): number => {
    return Object.values(allowances || {}).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
  };

  const handleCreateStructure = async (structureData: Partial<SalaryStructure>) => {
    await createSalaryStructure(structureData);
    setShowCreateDialog(false);
  };

  const handleQuickAddStructure = async (structureData: Partial<SalaryStructure>) => {
    await createSalaryStructure(structureData);
    setShowQuickAddDialog(false);
  };

  const handleUpdateStructure = async (structureData: Partial<SalaryStructure>) => {
    if (editingStructure) {
      await updateSalaryStructure(editingStructure.id, structureData);
      setEditingStructure(null);
    }
  };

  const handleEditStructure = (structure: SalaryStructure) => {
    setEditingStructure(structure);
  };

  const handleDeleteStructure = async (id: string) => {
    if (confirm('確定要刪除這個薪資結構嗎？')) {
      await deleteSalaryStructure(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
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

      {/* 使用通用篩選組件（API 模式） */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={salaryStructures}
        filteredData={filteredStructures}
        apiService={salaryStructureApiFilterService}
        loading={filterLoading}
        title="薪資結構篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
        onRefresh={refresh}
      />

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
                ? formatCurrency(
                    salaryStructures.reduce((sum, s) => sum + s.base_salary, 0) /
                      salaryStructures.length
                  )
                : formatCurrency(0)}
            </p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-white/80">最高薪資</p>
            <p className="text-sm font-bold text-white">
              {salaryStructures.length > 0
                ? formatCurrency(Math.max(...salaryStructures.map(s => s.base_salary)))
                : formatCurrency(0)}
            </p>
          </div>
        </div>
      </div>

      {/* 薪資結構列表 */}
      {isMobile ? (
        <div>
          {filteredStructures.map(structure => (
            <div
              key={structure.id}
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 mb-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm text-white">{structure.position}</h3>
                  <p className="text-xs text-white/70">
                    {structure.department} · Level {structure.level}
                  </p>
                </div>
                <Badge
                  className={
                    structure.is_active
                      ? 'bg-green-500/20 text-green-100 border-green-400/30'
                      : 'bg-gray-500/20 text-gray-100 border-gray-400/30'
                  }
                >
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
                  <p className="font-medium text-white">
                    {formatCurrency(calculateTotalAllowances(structure.allowances))}
                  </p>
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
              <div className="text-center text-white/70 text-sm">沒有找到相關的薪資結構</div>
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
              {filteredStructures.map(structure => (
                <TableRow key={structure.id} className="border-white/20 hover:bg-white/10">
                  <TableCell className="font-medium text-white">{structure.position}</TableCell>
                  <TableCell className="text-white/90">{structure.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/30 text-white/90">
                      Level {structure.level}
                    </Badge>
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
                    <Badge
                      className={
                        structure.is_active
                          ? 'bg-green-500/20 text-green-100 border-green-400/30'
                          : 'bg-gray-500/20 text-gray-100 border-gray-400/30'
                      }
                    >
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
            <div className="text-center py-8 text-white/70">沒有找到相關的薪資結構</div>
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
        onOpenChange={open => !open && setEditingStructure(null)}
        onSubmit={handleUpdateStructure}
        initialData={editingStructure}
        title="編輯薪資結構"
      />
    </div>
  );
};

export default SalaryStructureManagement;
