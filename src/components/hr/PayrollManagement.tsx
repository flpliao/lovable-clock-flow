
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
          薪資管理
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="text-xs">
            <Calculator className="h-3 w-3 mr-1" />
            批量
          </Button>
          <Button size="sm" className="text-xs">
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

      <PayrollStats />

      <PayrollTable payrolls={filteredPayrolls} />
    </div>
  );
};

export default PayrollManagement;
