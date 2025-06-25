
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OvertimeHistory: React.FC = () => {
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOvertimeHistory();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadOvertimeHistory = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      console.log('🔄 載入加班歷史記錄...');
      
      const history = await overtimeService.getUserOvertimeRequests();
      setRequests(history);
      console.log('✅ 加班歷史記錄載入成功:', history.length, '筆');
    } catch (error: any) {
      console.error('❌ 載入加班歷史失敗:', error);
      
      const errorMessage = error?.message || '載入加班歷史失敗';
      
      if (errorMessage.includes('未登入') || errorMessage.includes('認證')) {
        setAuthError('登入狀態已過期，請重新登入');
      } else {
        setAuthError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('🔄 用戶點擊重試載入');
    loadOvertimeHistory();
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
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
            加班記錄
          </h2>
          <p className="text-white/80 font-medium drop-shadow-sm">
            查看您的加班申請歷史記錄
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-white mr-2" />
            <span className="text-white">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
            加班記錄
          </h2>
          <p className="text-white/80 font-medium drop-shadow-sm">
            查看您的加班申請歷史記錄
          </p>
        </div>
        <Alert className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 shadow-xl">
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertDescription className="text-red-200">
            {authError}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入
          </Button>
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
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="pending">待審核</SelectItem>
              <SelectItem value="approved">已核准</SelectItem>
              <SelectItem value="rejected">已拒絕</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
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
            <p className="text-white/80">
              {requests.length === 0 
                ? '您還沒有提交過加班申請' 
                : '請調整篩選條件以查看其他記錄'
              }
            </p>
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

                  <div className="pt-2 border-t border-white/20">
                    <div className="text-xs text-white/60">
                      申請時間：{new Date(request.created_at).toLocaleString('zh-TW')}
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
          共 {filteredRequests.length} 筆記錄
        </div>
      )}
    </div>
  );
};

export default OvertimeHistory;
