import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentUser } from '@/hooks/useStores';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const OvertimeHistory: React.FC = () => {
  const currentUser = useCurrentUser();
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOvertimeHistory();
  }, [currentUser?.id]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

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
        description: error?.message || '請稍後重試'
      });
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.overtime_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    console.log('🔍 篩選結果:', {
      原始記錄數: requests.length,
      篩選後記錄數: filtered.length,
      搜尋條件: searchTerm,
      狀態篩選: statusFilter
    });

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '待審核', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { text: '已核准', className: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { text: '已拒絕', className: 'bg-red-100 text-red-800 border-red-300' },
      cancelled: { text: '已取消', className: 'bg-gray-100 text-gray-800 border-gray-300' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
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
        <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
          加班記錄
        </h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          查看您的加班申請歷史記錄
          {currentUser && (
            <span className="block text-sm text-white/60 mt-1">
              當前用戶: {currentUser.name} (ID: {currentUser.id})
            </span>
          )}
        </p>
      </div>

      {/* 篩選器 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white drop-shadow-md">篩選條件</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              placeholder="搜尋加班原因或類型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
              <SelectItem value="all">全部狀態 ({requests.length})</SelectItem>
              <SelectItem value="pending">待審核 ({requests.filter(r => r.status === 'pending').length})</SelectItem>
              <SelectItem value="approved">已核准 ({requests.filter(r => r.status === 'approved').length})</SelectItem>
              <SelectItem value="rejected">已拒絕 ({requests.filter(r => r.status === 'rejected').length})</SelectItem>
              <SelectItem value="cancelled">已取消 ({requests.filter(r => r.status === 'cancelled').length})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={loadOvertimeHistory}
            disabled={isLoading}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {isLoading ? '載入中...' : '重新載入'}
          </Button>
        </div>
      </div>

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
              {requests.length === 0 
                ? '您還沒有提交過加班申請' 
                : '請調整篩選條件以查看其他記錄'
              }
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
          filteredRequests.map((request) => (
            <Card key={request.id} className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
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
          <span className="text-xs text-white/40">
            使用 Supabase Auth JWT Token 進行身份驗證
          </span>
        </div>
      )}
    </div>
  );
};

export default OvertimeHistory;
