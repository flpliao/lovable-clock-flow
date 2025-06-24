
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
  approved_by_name?: string;
  approval_date: string | null;
  approval_comment: string | null;
  rejection_reason?: string;
  compensation_hours: number | null;
  updated_at: string;
  staff?: {
    name: string;
  };
  overtime_approval_records?: Array<{
    id: string;
    approver_id: string | null;
    approver_name: string;
    level: number;
    status: string;
    approval_date: string | null;
    comment: string | null;
    created_at: string;
  }>;
}

const OvertimeHistory: React.FC = () => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [overtimes, setOvertimes] = useState<OvertimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 載入加班記錄（包含所有狀態的記錄）
  useEffect(() => {
    const loadOvertimeRecords = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 載入加班記錄...');
        const records = await overtimeService.getOvertimeRequestsByStaff(currentUser.id);
        
        // 按狀態排序：pending 在前，然後按建立時間倒序
        const sortedRecords = records.sort((a, b) => {
          // 如果一個是 pending 另一個不是，pending 排在前面
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
          // 其他情況按建立時間倒序排列
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setOvertimes(sortedRecords);
        console.log('✅ 載入完成:', sortedRecords.length, '筆記錄');
        console.log('📊 狀態統計:', {
          pending: sortedRecords.filter(r => r.status === 'pending').length,
          approved: sortedRecords.filter(r => r.status === 'approved').length,
          rejected: sortedRecords.filter(r => r.status === 'rejected').length
        });
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

  const pendingCount = filteredOvertimes.filter(o => o.status === 'pending').length;
  const approvedCount = filteredOvertimes.filter(o => o.status === 'approved').length;
  const rejectedCount = filteredOvertimes.filter(o => o.status === 'rejected').length;

  return (
    <div className="space-y-8">
      <OvertimeHistoryHeader />

      {/* 狀態統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">{pendingCount}</div>
            <div className="text-yellow-200 text-sm">審核中</div>
          </div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">{approvedCount}</div>
            <div className="text-green-200 text-sm">已核准</div>
          </div>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-300">{rejectedCount}</div>
            <div className="text-red-200 text-sm">已拒絕</div>
          </div>
        </div>
      </div>

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
          <OvertimeRecordCard 
            key={overtime.id} 
            overtime={overtime} 
            showApprovalProcess={true}
          />
        ))}
        {filteredOvertimes.length === 0 && <OvertimeEmptyState />}
      </div>
    </div>
  );
};

export default OvertimeHistory;
