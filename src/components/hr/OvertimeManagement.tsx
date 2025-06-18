
import React, { useState } from 'react';
import HROvertimeHeader from './overtime/HROvertimeHeader';
import HROvertimeFilters from './overtime/HROvertimeFilters';
import HROvertimeCard from './overtime/HROvertimeCard';
import HROvertimeEmptyState from './overtime/HROvertimeEmptyState';

const OvertimeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 模擬資料
  const overtimes = [
    {
      id: '1',
      staff_name: '王小強',
      overtime_date: '2024-01-15',
      start_time: '2024-01-15T18:00:00Z',
      end_time: '2024-01-15T21:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '專案趕工',
      status: 'pending' as const
    },
    {
      id: '2',
      staff_name: '陳小美',
      overtime_date: '2024-01-14',
      start_time: '2024-01-14T09:00:00Z',
      end_time: '2024-01-14T17:00:00Z',
      hours: 8,
      overtime_type: 'weekend' as const,
      compensation_type: 'time_off' as const,
      reason: '系統維護',
      status: 'approved' as const
    }
  ];

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <HROvertimeHeader />

      <HROvertimeFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <div className="space-y-3">
        {filteredOvertimes.map((overtime) => (
          <HROvertimeCard key={overtime.id} overtime={overtime} />
        ))}
        {filteredOvertimes.length === 0 && <HROvertimeEmptyState />}
      </div>
    </div>
  );
};

export default OvertimeManagement;
