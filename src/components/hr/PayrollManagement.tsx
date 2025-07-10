import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Calculator, RefreshCw, TrendingUp, Users, FileText } from 'lucide-react';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';
import PayrollStats from './payroll/PayrollStats';
import PayrollTable from './payroll/PayrollTable';
import PayrollFormDialog from './payroll/PayrollFormDialog';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import { Payroll } from '@/types/hr';

interface PayrollWithStaff extends Payroll {
  staff?: {
    id: string;
    name: string;
    position: string;
    department: string;
  };
}

// 薪資管理 API 篩選服務
class PayrollApiFilterService {
  async filter(request: {
    conditionGroups: FilterGroup[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: PayrollWithStaff[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用本地篩選作為示範
      // 注意：實際實作時需要從 API 獲取資料

      // 暫時返回空資料，實際實作時需要從 API 獲取
      return {
        data: [],
        total: 0,
        totalPages: 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('篩選薪資記錄失敗:', error);
      throw error;
    }
  }

  // 獲取狀態選項
  getStatusOptions() {
    return [
      { value: 'pending', label: '待審核' },
      { value: 'approved', label: '已核准' },
      { value: 'rejected', label: '已拒絕' },
      { value: 'paid', label: '已發放' },
      { value: 'cancelled', label: '已取消' },
    ];
  }

  // 獲取部門選項
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

  // 獲取職位選項
  getPositionOptions() {
    return [
      { value: 'manager', label: '經理' },
      { value: 'senior', label: '資深專員' },
      { value: 'specialist', label: '專員' },
      { value: 'assistant', label: '助理' },
      { value: 'intern', label: '實習生' },
    ];
  }
}

const payrollApiFilterService = new PayrollApiFilterService();

const PayrollManagement: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<PayrollWithStaff | null>(null);

  const {
    payrolls,
    stats,
    isLoading,
    createPayroll,
    updatePayroll,
    deletePayroll,
    approvePayroll,
    rejectPayroll,
    markAsPaid,
    refresh,
  } = usePayrollManagement();

  // 定義搜尋欄位（包含下拉選單配置）
  const SEARCH_FIELDS: SearchField[] = useMemo(
    () => [
      {
        value: 'staff_name',
        label: '員工姓名',
        type: 'input',
        placeholder: '請輸入員工姓名',
      },
      {
        value: 'staff_position',
        label: '職位',
        type: 'select',
        options: payrollApiFilterService.getPositionOptions(),
        placeholder: '請選擇職位',
      },
      {
        value: 'staff_department',
        label: '部門',
        type: 'select',
        options: payrollApiFilterService.getDepartmentOptions(),
        placeholder: '請選擇部門',
      },
      {
        value: 'status',
        label: '狀態',
        type: 'select',
        options: payrollApiFilterService.getStatusOptions(),
        placeholder: '請選擇狀態',
      },
      {
        value: 'pay_period_start',
        label: '薪資期間開始',
        type: 'input',
        placeholder: '請輸入開始日期 (YYYY-MM-DD)',
      },
      {
        value: 'pay_period_end',
        label: '薪資期間結束',
        type: 'input',
        placeholder: '請輸入結束日期 (YYYY-MM-DD)',
      },
    ],
    []
  );

  // 使用通用篩選 Hook（API 模式）
  const {
    conditionGroups,
    filteredData: filteredPayrolls,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
    loading: filterLoading,
  } = useAdvancedFilter({
    data: payrolls as PayrollWithStaff[],
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: () => true, // API 模式下不需要本地篩選
    apiService: payrollApiFilterService,
  });

  const handleCreatePayroll = async (payrollData: Partial<Payroll>) => {
    await createPayroll(payrollData);
    setShowCreateDialog(false);
  };

  const handleUpdatePayroll = async (payrollData: Partial<Payroll>) => {
    if (editingPayroll) {
      await updatePayroll(editingPayroll.id, payrollData);
      setEditingPayroll(null);
    }
  };

  const handleEditPayroll = (payroll: PayrollWithStaff) => {
    setEditingPayroll(payroll);
  };

  const handleDeletePayroll = async (id: string) => {
    if (confirm('確定要刪除這筆薪資記錄嗎？')) {
      await deletePayroll(id);
    }
  };

  const handleApprovePayroll = async (payrollId: string, comment?: string) => {
    await approvePayroll(payrollId, comment);
  };

  const handleRejectPayroll = async (payrollId: string, comment: string) => {
    await rejectPayroll(payrollId, comment);
  };

  const handleMarkAsPaid = async (payrollId: string, paymentData: Record<string, unknown>) => {
    await markAsPaid(payrollId, paymentData);
  };

  return (
    <div className="space-y-6">
      {/* 操作區域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/70 rounded-xl shadow-lg">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">薪資管理</h3>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => {
              /* TODO: 批量計算功能 */
            }}
          >
            <Calculator className="h-3 w-3 mr-1" />
            批量計算
          </Button>
          <Button
            size="sm"
            className="text-xs bg-blue-500/70 hover:bg-blue-600/70 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            新增
          </Button>
        </div>
      </div>

      {/* 使用通用篩選組件（API 模式） */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/70 rounded-xl shadow-lg">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">篩選條件</h3>
        </div>
        <AdvancedFilter
          searchFields={SEARCH_FIELDS}
          operators={DEFAULT_OPERATORS}
          conditionGroups={conditionGroups}
          onConditionGroupsChange={setConditionGroups}
          data={payrolls as PayrollWithStaff[]}
          filteredData={filteredPayrolls}
          apiService={payrollApiFilterService}
          loading={filterLoading}
          title="薪資記錄篩選"
          showAdvancedFilters={showAdvancedFilters}
          onShowAdvancedFiltersChange={setShowAdvancedFilters}
          onClearAll={clearAllConditions}
          onRefresh={refresh}
        />
      </div>

      {/* 統計區域 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/70 rounded-xl shadow-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">統計資料</h3>
        </div>
        <PayrollStats stats={stats} isLoading={isLoading} />
      </div>

      {/* 表格區域 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">薪資記錄列表</h3>
        </div>
        <PayrollTable
          payrolls={filteredPayrolls}
          isLoading={isLoading}
          onEdit={handleEditPayroll}
          onDelete={handleDeletePayroll}
          onUpdateStatus={updatePayroll}
          onApprove={handleApprovePayroll}
          onReject={handleRejectPayroll}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>

      <PayrollFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePayroll}
        title="新增薪資記錄"
      />

      <PayrollFormDialog
        open={!!editingPayroll}
        onOpenChange={open => !open && setEditingPayroll(null)}
        onSubmit={handleUpdatePayroll}
        initialData={editingPayroll}
        title="編輯薪資記錄"
      />
    </div>
  );
};

export default PayrollManagement;
