
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Calculator, RefreshCw } from 'lucide-react';
import PayrollFilters from './payroll/PayrollFilters';
import PayrollStats from './payroll/PayrollStats';
import PayrollTable from './payroll/PayrollTable';
import PayrollFormDialog from './payroll/PayrollFormDialog';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';

const PayrollManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<any>(null);

  const {
    payrolls,
    stats,
    isLoading,
    createPayroll,
    updatePayroll,
    deletePayroll,
    refresh
  } = usePayrollManagement();

  const filteredPayrolls = payrolls.filter(payroll => {
    const staffInfo = payroll.staff;
    const matchesSearch = staffInfo ? (
      staffInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffInfo.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffInfo.department.toLowerCase().includes(searchTerm.toLowerCase())
    ) : false;
    const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreatePayroll = async (payrollData: any) => {
    await createPayroll(payrollData);
    setShowCreateDialog(false);
  };

  const handleUpdatePayroll = async (payrollData: any) => {
    if (editingPayroll) {
      await updatePayroll(editingPayroll.id, payrollData);
      setEditingPayroll(null);
    }
  };

  const handleEditPayroll = (payroll: any) => {
    setEditingPayroll(payroll);
  };

  const handleDeletePayroll = async (id: string) => {
    if (confirm('確定要刪除這筆薪資記錄嗎？')) {
      await deletePayroll(id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
          薪資管理
        </h2>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {/* TODO: 批量計算功能 */}}
          >
            <Calculator className="h-3 w-3 mr-1" />
            批量計算
          </Button>
          <Button 
            size="sm" 
            className="text-xs"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            新增
          </Button>
        </div>
      </div>

      <PayrollFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
      />

      <PayrollStats stats={stats} isLoading={isLoading} />

      <PayrollTable 
        payrolls={filteredPayrolls} 
        isLoading={isLoading}
        onEdit={handleEditPayroll}
        onDelete={handleDeletePayroll}
        onUpdateStatus={updatePayroll}
      />

      <PayrollFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePayroll}
        title="新增薪資記錄"
      />

      <PayrollFormDialog
        open={!!editingPayroll}
        onOpenChange={(open) => !open && setEditingPayroll(null)}
        onSubmit={handleUpdatePayroll}
        initialData={editingPayroll}
        title="編輯薪資記錄"
      />
    </div>
  );
};

export default PayrollManagement;
