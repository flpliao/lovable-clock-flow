
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

  console.log('🔍 HR 加班管理組件載入:', {
    canManageOvertime,
    loading,
    overtimeCount: overtimes.length
  });

  // 載入所有加班記錄
  useEffect(() => {
    const loadAllOvertimes = async () => {
      if (!canManageOvertime) {
        console.log('❌ 沒有管理權限，停止載入');
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
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
          <div className="text-white/80 text-lg">您沒有管理加班的權限</div>
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
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full">
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <HROvertimeHeader />
            <div className="text-center py-8">
              <div className="text-white/80 text-lg">載入中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 w-full">
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8 space-y-6">
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
    </div>
  );
};

export default OvertimeManagement;
