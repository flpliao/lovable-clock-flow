
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { useToast } from '@/hooks/use-toast';
import { OvertimeService, OvertimeRequest } from '@/services/overtimeService';
import OvertimeHistoryHeader from './components/OvertimeHistoryHeader';
import OvertimeSearchFilters from './components/OvertimeSearchFilters';
import OvertimeRecordCard from './components/OvertimeRecordCard';
import OvertimeEmptyState from './components/OvertimeEmptyState';

const OvertimeHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [overtimes, setOvertimes] = useState<OvertimeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useUser();
  const { staffList } = useStaffManagementContext();
  const { hasPermission } = useUnifiedPermissions();
  const { toast } = useToast();

  // 權限檢查
  const canViewOvertime = hasPermission('overtime:view');

  // 獲取當前用戶的員工資料
  const currentStaff = staffList.find(staff => 
    staff.email === currentUser?.name || 
    staff.name === currentUser?.name ||
    staff.id === currentUser?.id
  );

  // 載入加班記錄
  useEffect(() => {
    const loadOvertimeHistory = async () => {
      if (!canViewOvertime || !currentStaff) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 載入加班記錄...');
        setLoading(true);
        
        const data = await OvertimeService.getUserOvertimeHistory(currentStaff.id);
        setOvertimes(data);
        
        console.log('✅ 加班記錄載入完成:', data.length, '筆');
      } catch (error) {
        console.error('❌ 載入加班記錄失敗:', error);
        toast({
          title: '載入失敗',
          description: '載入加班記錄時發生錯誤',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOvertimeHistory();
  }, [canViewOvertime, currentStaff, toast]);

  if (!canViewOvertime) {
    return (
      <div className="text-center py-8">
        <div className="text-white/80 text-lg">
          您沒有查看加班記錄的權限
        </div>
      </div>
    );
  }

  if (!currentStaff) {
    return (
      <div className="text-center py-8">
        <div className="text-white/80 text-lg">
          找不到您的員工資料
        </div>
      </div>
    );
  }

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="text-white/80 text-lg">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 搜尋和篩選區域 */}
      <OvertimeSearchFilters 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
        typeFilter={typeFilter} 
        onSearchTermChange={setSearchTerm} 
        onStatusFilterChange={setStatusFilter} 
        onTypeFilterChange={setTypeFilter} 
      />

      {/* 加班記錄列表 */}
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
