import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useStores';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';
import { Calendar, Clock } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';

// 加班歷史 API 篩選服務
class OvertimeHistoryApiService {
  async filter(request: {
    conditionGroups: FilterGroup[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: OvertimeRequest[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { conditionGroups, page = 1, pageSize = 10 } = request;

      // 這裡可以實作真正的 API 呼叫
      // 目前先使用本地篩選作為示範
      const allRequests = await overtimeService.getUserOvertimeRequests();

      // 應用篩選條件
      const filteredData = allRequests.filter(request =>
        applyMultiConditionFilter(request, conditionGroups, (item, field) => {
          if (field === 'overtime_date') {
            return new Date(item.overtime_date).toLocaleDateString('zh-TW');
          }
          if (field === 'hours') {
            return item.hours.toString();
          }
          return (item[field as keyof OvertimeRequest] || '').toString();
        })
      );

      // 分頁處理
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
        page,
        pageSize,
      };
    } catch (error) {
      console.error('篩選加班記錄失敗:', error);
      throw error;
    }
  }

  // 獲取加班類型選項
  getOvertimeTypeOptions() {
    return [
      { value: 'regular', label: '一般加班' },
      { value: 'holiday', label: '假日加班' },
      { value: 'night', label: '夜間加班' },
      { value: 'weekend', label: '週末加班' },
    ];
  }

  // 獲取狀態選項
  getStatusOptions() {
    return [
      { value: 'pending', label: '待審核' },
      { value: 'approved', label: '已核准' },
      { value: 'rejected', label: '已拒絕' },
      { value: 'cancelled', label: '已取消' },
    ];
  }
}

const overtimeHistoryApiService = new OvertimeHistoryApiService();

const OvertimeHistory: React.FC = () => {
  const currentUser = useCurrentUser();
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // 定義搜尋欄位（包含下拉選單配置）
  const SEARCH_FIELDS: SearchField[] = useMemo(
    () => [
      {
        value: 'overtime_type',
        label: '加班類型',
        type: 'select',
        options: overtimeHistoryApiService.getOvertimeTypeOptions(),
        placeholder: '請選擇加班類型',
      },
      {
        value: 'status',
        label: '狀態',
        type: 'select',
        options: overtimeHistoryApiService.getStatusOptions(),
        placeholder: '請選擇狀態',
      },
      {
        value: 'reason',
        label: '加班原因',
        type: 'input',
        placeholder: '請輸入加班原因',
      },
      {
        value: 'overtime_date',
        label: '加班日期',
        type: 'input',
        placeholder: '請輸入日期 (YYYY-MM-DD)',
      },
      {
        value: 'hours',
        label: '加班時數',
        type: 'input',
        placeholder: '請輸入時數',
      },
    ],
    []
  );

  // 使用通用篩選 Hook（API 模式）
  const {
    conditionGroups,
    filteredData: filteredRequests,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
    loading: filterLoading,
  } = useAdvancedFilter({
    data: requests,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: () => true, // API 模式下不需要本地篩選
    serviceType: 'overtime',
  });

  useEffect(() => {
    loadOvertimeHistory();
  }, [currentUser?.id]);

  const loadOvertimeHistory = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 載入加班歷史記錄 - 當前用戶:', currentUser?.id, currentUser?.name);

      // 直接使用 overtimeService，它會自動使用 Supabase Auth 獲取當前用戶的記錄
      const history = await overtimeService.getUserOvertimeRequests();
      console.log('📋 載入的加班記錄:', history);
      console.log('📊 記錄統計:', {
        總計: history.length,
        pending: history.filter(r => r.status === 'pending').length,
        approved: history.filter(r => r.status === 'approved').length,
        rejected: history.filter(r => r.status === 'rejected').length,
      });

      setRequests(history);
    } catch (error) {
      console.error('❌ 載入加班歷史失敗:', error);
      toast.error('載入加班歷史失敗', {
        description: error?.message || '請稍後重試',
      });
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理分頁變更
  const handlePaginationChange = async (page: number, pageSize: number) => {
    try {
      const result = await overtimeHistoryApiService.filter({
        conditionGroups,
        page,
        pageSize,
      });
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      });
      setRequests(result.data);
    } catch (error) {
      console.error('分頁載入失敗:', error);
      toast.error('載入資料失敗');
    }
  };

  // 重新整理資料
  const handleRefresh = async () => {
    await loadOvertimeHistory();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '待審核', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { text: '已核准', className: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { text: '已拒絕', className: 'bg-red-100 text-red-800 border-red-300' },
      cancelled: { text: '已取消', className: 'bg-gray-100 text-gray-800 border-gray-300' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">加班記錄</h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          查看您的加班申請歷史記錄
          {currentUser && (
            <span className="block text-sm text-white/60 mt-1">
              當前用戶: {currentUser.name} (ID: {currentUser.id})
            </span>
          )}
        </p>
      </div>

      {/* 使用通用篩選組件（API 模式） */}
      <AdvancedFilter
        searchFields={SEARCH_FIELDS}
        operators={DEFAULT_OPERATORS}
        conditionGroups={conditionGroups}
        onConditionGroupsChange={setConditionGroups}
        data={requests}
        filteredData={filteredRequests}
        apiService={overtimeHistoryApiService}
        loading={filterLoading}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        title="加班記錄篩選"
        showAdvancedFilters={showAdvancedFilters}
        onShowAdvancedFiltersChange={setShowAdvancedFilters}
        onClearAll={clearAllConditions}
        onRefresh={handleRefresh}
        className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6"
      />

      {/* 記錄列表 */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8 text-center">
            <div className="text-white/60 mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {requests.length === 0 ? '暫無加班記錄' : '沒有符合條件的記錄'}
            </h3>
            <p className="text-white/80 mb-4">
              {requests.length === 0 ? '您還沒有提交過加班申請' : '請調整篩選條件以查看其他記錄'}
            </p>
            {requests.length === 0 && (
              <Button
                onClick={loadOvertimeHistory}
                className="bg-white/30 border-white/30 text-white hover:bg-white/40"
              >
                重新載入
              </Button>
            )}
          </div>
        ) : (
          filteredRequests.map(request => (
            <Card
              key={request.id}
              className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/80" />
                      <span className="text-white font-medium">
                        {new Date(request.overtime_date).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/80" />
                      <span className="text-white/90">
                        {request.start_time} - {request.end_time} ({request.hours}小時)
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/70 mb-1">加班類型</div>
                    <div className="text-white font-medium">{request.overtime_type}</div>
                  </div>

                  <div>
                    <div className="text-sm text-white/70 mb-1">加班原因</div>
                    <div className="text-white/90 text-sm">{request.reason}</div>
                  </div>

                  {request.rejection_reason && (
                    <div>
                      <div className="text-sm text-red-300 mb-1">拒絕原因</div>
                      <div className="text-red-200 text-sm bg-red-500/20 p-2 rounded-lg border border-red-300/30">
                        {request.rejection_reason}
                      </div>
                    </div>
                  )}

                  {request.approval_comment && (
                    <div>
                      <div className="text-sm text-green-300 mb-1">審核意見</div>
                      <div className="text-green-200 text-sm bg-green-500/20 p-2 rounded-lg border border-green-300/30">
                        {request.approval_comment}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/20">
                    <div className="text-xs text-white/60">
                      申請時間：{new Date(request.created_at).toLocaleString('zh-TW')}
                      {request.approval_date && (
                        <span className="ml-4">
                          審核時間：{new Date(request.approval_date).toLocaleString('zh-TW')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredRequests.length > 0 && (
        <div className="text-center text-white/60 text-sm">
          共 {filteredRequests.length} 筆記錄 (總計 {requests.length} 筆)
          <br />
          <span className="text-xs text-white/40">使用 Supabase Auth JWT Token 進行身份驗證</span>
        </div>
      )}
    </div>
  );
};

export default OvertimeHistory;
