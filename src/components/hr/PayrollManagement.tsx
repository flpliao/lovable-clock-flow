import React, { useState } from 'react';
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

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'staff_name', label: '員工姓名' },
    { value: 'staff_position', label: '職位' },
    { value: 'staff_department', label: '部門' },
    { value: 'status', label: '狀態' },
    { value: 'pay_period_start', label: '薪資期間開始' },
    { value: 'pay_period_end', label: '薪資期間結束' },
  ];

  // 篩選函數
  const applyPayrollFilter = (payroll: PayrollWithStaff, conditionGroups: FilterGroup[]) => {
    return applyMultiConditionFilter(payroll, conditionGroups, (item, field) => {
      if (field === 'staff_name') {
        return item.staff?.name || '';
      }
      if (field === 'staff_position') {
        return item.staff?.position || '';
      }
      if (field === 'staff_department') {
        return item.staff?.department || '';
      }
      return (item[field as keyof PayrollWithStaff] || '').toString();
    });
  };

  // 使用通用篩選 Hook
  const {
    conditionGroups,
    filteredData: filteredPayrolls,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
  } = useAdvancedFilter({
    data: payrolls as PayrollWithStaff[],
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: applyPayrollFilter,
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

      {/* 使用通用篩選組件 */}
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
          applyFilter={applyPayrollFilter}
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
