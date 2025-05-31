
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Calculator } from 'lucide-react';
import PayrollFilters from './payroll/PayrollFilters';
import PayrollStats from './payroll/PayrollStats';
import PayrollTable from './payroll/PayrollTable';
import { mockPayrolls, mockStaffData } from './payroll/mockPayrollData';

const PayrollManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current');

  const filteredPayrolls = mockPayrolls.filter(payroll => {
    const staffInfo = mockStaffData[payroll.staff_id as keyof typeof mockStaffData];
    const matchesSearch = staffInfo ? (
      staffInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffInfo.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffInfo.department.toLowerCase().includes(searchTerm.toLowerCase())
    ) : false;
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

      <PayrollFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
      />

      <PayrollStats />

      <PayrollTable payrolls={filteredPayrolls} />
    </div>
  );
};

export default PayrollManagement;
