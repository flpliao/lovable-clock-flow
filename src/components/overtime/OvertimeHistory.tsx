import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { overtimeService } from '@/services/overtimeService';
import OvertimeHistoryHeader from './components/OvertimeHistoryHeader';
import OvertimeSearchFilters from './components/OvertimeSearchFilters';
import OvertimeRecordCard from './components/OvertimeRecordCard';
import OvertimeEmptyState from './components/OvertimeEmptyState';

interface OvertimeRecord {
  id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  staff_id: string;
  approved_by: string | null;
  approval_date: string | null;
  approval_comment: string | null;
  compensation_hours: number | null;
  updated_at: string;
  staff?: {
    name: string;
  };
}

const OvertimeHistory: React.FC = () => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [overtimes, setOvertimes] = useState<OvertimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 載入加班記錄
  useEffect(() => {
    const loadOvertimeRecords = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 載入加班記錄...');
        const records = await overtimeService.getOvertimeRequestsByStaff(currentUser.id);
        setOvertimes(records);
        console.log('✅ 載入完成:', records.length, '筆記錄');
      } catch (error) {
        console.error('❌ 載入加班記錄失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOvertimeRecords();
  }, [currentUser]);

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <OvertimeHistoryHeader />
        <div className="flex justify-center items-center py-12">
          <div className="text-white">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OvertimeHistoryHeader />

      <OvertimeSearchFilters 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
        typeFilter={typeFilter} 
        onSearchTermChange={setSearchTerm} 
        onStatusFilterChange={setStatusFilter} 
        onTypeFilterChange={setTypeFilter} 
      />

      <div className="space-y-6">
        {filteredOvertimes.map(overtime => (
          <OvertimeRecordCard key={overtime.id} overtime={overtime} />
        ))}
        {filteredOvertimes.length === 0 && <OvertimeEmptyState />}
      </div>
    </div>
  );
};

export default OvertimeHistory;
