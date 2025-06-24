
import React, { useState, useEffect } from 'react';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { useToast } from '@/hooks/use-toast';
import { OvertimeService, OvertimeRecord } from '@/services/overtimeService';
import HROvertimeHeader from './overtime/HROvertimeHeader';
import HROvertimeFilters from './overtime/HROvertimeFilters';
import HROvertimeCard from './overtime/HROvertimeCard';
import HROvertimeEmptyState from './overtime/HROvertimeEmptyState';

const OvertimeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [overtimes, setOvertimes] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { hasPermission } = useUnifiedPermissions();
  const { toast } = useToast();

  // 權限檢查
  const canManageOvertime = hasPermission('hr:overtime_manage') || hasPermission('overtime:manage');

  // 載入所有加班記錄
  useEffect(() => {
    const loadAllOvertimes = async () => {
      if (!canManageOvertime) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 載入所有加班記錄...');
        setLoading(true);
        
        const data = await OvertimeService.getAllOvertimeRequests();
        setOvertimes(data);
        
        console.log('✅ 所有加班記錄載入完成:', data.length, '筆');
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

    loadAllOvertimes();
  }, [canManageOvertime, toast]);

  if (!canManageOvertime) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 text-lg">
          您沒有管理加班的權限
        </div>
      </div>
    );
  }

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <HROvertimeHeader />
        <div className="text-center py-8">
          <div className="text-gray-600 text-lg">載入中...</div>
        </div>
      </div>
    );
  }

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
