
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 space-y-6 p-6 pt-16 md:pt-20">
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
    </div>
  );
};

export default OvertimeManagement;
