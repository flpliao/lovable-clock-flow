
import React, { useState } from 'react';
import OvertimeHistoryHeader from './components/OvertimeHistoryHeader';
import OvertimeSearchFilters from './components/OvertimeSearchFilters';
import OvertimeRecordCard from './components/OvertimeRecordCard';
import OvertimeEmptyState from './components/OvertimeEmptyState';

const OvertimeHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 模擬當前用戶的加班記錄
  const overtimes = [
    {
      id: '1',
      overtime_date: '2024-01-15',
      start_time: '2024-01-15T18:00:00Z',
      end_time: '2024-01-15T21:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '專案趕工',
      status: 'approved' as const,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      overtime_date: '2024-01-14',
      start_time: '2024-01-14T09:00:00Z',
      end_time: '2024-01-14T17:00:00Z',
      hours: 8,
      overtime_type: 'weekend' as const,
      compensation_type: 'time_off' as const,
      reason: '系統維護',
      status: 'pending' as const,
      created_at: '2024-01-14T08:00:00Z'
    },
    {
      id: '3',
      overtime_date: '2024-01-10',
      start_time: '2024-01-10T19:00:00Z',
      end_time: '2024-01-10T22:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '客戶需求變更',
      status: 'rejected' as const,
      created_at: '2024-01-10T15:00:00Z'
    }
  ];

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-12">
      {/* 搜尋和篩選卡片 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
        <OvertimeHistoryHeader />
        <OvertimeSearchFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onSearchTermChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      {/* 加班記錄列表 */}
      <div className="space-y-6">
        {filteredOvertimes.map((overtime) => (
          <OvertimeRecordCard key={overtime.id} overtime={overtime} />
        ))}
        {filteredOvertimes.length === 0 && <OvertimeEmptyState />}
      </div>
    </div>
  );
};

export default OvertimeHistory;
