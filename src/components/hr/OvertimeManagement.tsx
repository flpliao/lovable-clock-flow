
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
  const [error, setError] = useState<string | null>(null);
  
  const { hasPermission, rolesLoading } = useUnifiedPermissions();
  const { toast } = useToast();

  // 權限檢查
  const canManageOvertime = hasPermission('hr:overtime_manage') || hasPermission('overtime:manage');
  const canViewAllOvertime = hasPermission('overtime:view_all');
  const canApproveOvertime = hasPermission('overtime:approve');

  console.log('🔍 HR 加班管理組件載入:', {
    canManageOvertime,
    canViewAllOvertime,
    canApproveOvertime,
    loading,
    rolesLoading,
    overtimeCount: overtimes.length
  });

  // 載入所有加班記錄
  useEffect(() => {
    const loadAllOvertimes = async () => {
      if (rolesLoading) {
        console.log('⏳ 等待權限載入完成...');
        return;
      }

      if (!canManageOvertime && !canViewAllOvertime) {
        console.log('❌ 沒有管理權限，停止載入');
        setError('您沒有管理加班的權限');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 載入所有加班記錄...');
        setLoading(true);
        setError(null);
        
        const data = await OvertimeService.getAllOvertimeRequests();
        setOvertimes(data);
        
        console.log('✅ 所有加班記錄載入完成:', data.length, '筆');
      } catch (error) {
        console.error('❌ 載入加班記錄失敗:', error);
        const errorMessage = error instanceof Error ? error.message : '載入加班記錄時發生錯誤';
        setError(errorMessage);
        toast({
          title: '載入失敗',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllOvertimes();
  }, [canManageOvertime, canViewAllOvertime, rolesLoading, toast]);

  // 權限不足時的顯示
  if (!rolesLoading && !canManageOvertime && !canViewAllOvertime) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/30">
            <div className="text-white/80 text-lg">您沒有管理加班的權限</div>
            <div className="text-white/60 text-sm mt-2">請聯繫系統管理員獲取相關權限</div>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態顯示
  if (error && !loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full">
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <HROvertimeHeader />
            <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-8 text-center border border-red-400/30 mt-8">
              <div className="text-red-100 text-lg font-medium mb-2">載入失敗</div>
              <div className="text-red-200/80">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-100 rounded-lg border border-red-400/30 transition-colors"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 載入中狀態
  if (loading || rolesLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full">
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <HROvertimeHeader />
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-2 text-white/80 text-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>載入中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 篩選加班記錄
  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  console.log('📊 加班記錄篩選結果:', {
    總記錄數: overtimes.length,
    篩選後數量: filteredOvertimes.length,
    搜尋條件: searchTerm,
    狀態篩選: statusFilter,
    類型篩選: typeFilter
  });

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

          {/* 統計資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="text-white/60 text-sm">總申請數</div>
              <div className="text-white text-2xl font-bold">{overtimes.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="text-white/60 text-sm">待審核</div>
              <div className="text-orange-300 text-2xl font-bold">
                {overtimes.filter(o => o.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="text-white/60 text-sm">已核准</div>
              <div className="text-green-300 text-2xl font-bold">
                {overtimes.filter(o => o.status === 'approved').length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="text-white/60 text-sm">已拒絕</div>
              <div className="text-red-300 text-2xl font-bold">
                {overtimes.filter(o => o.status === 'rejected').length}
              </div>
            </div>
          </div>

          {/* 加班記錄列表 */}
          <div className="space-y-3">
            {filteredOvertimes.length > 0 ? (
              filteredOvertimes.map((overtime) => (
                <HROvertimeCard key={overtime.id} overtime={overtime} />
              ))
            ) : (
              <HROvertimeEmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
