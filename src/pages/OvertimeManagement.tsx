
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, Calendar, Clock, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';

const OvertimeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOvertimeRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadOvertimeRequests = async () => {
    if (!currentUser?.id) return;
    
    try {
      // 管理員可以看到所有請求，一般用戶只能看到自己的
      const data = await overtimeService.getUserOvertimeRequests(currentUser.id);
      setRequests(data);
    } catch (error) {
      console.error('載入加班申請失敗:', error);
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

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '待審核', color: 'bg-yellow-100 text-yellow-800' },
      approved: { text: '已核准', color: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒絕', color: 'bg-red-100 text-red-800' },
      cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">加班管理</h1>
              <p className="text-gray-600">管理和查看加班申請記錄</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>篩選條件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜尋加班原因或類型..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    <SelectItem value="pending">待審核</SelectItem>
                    <SelectItem value="approved">已核准</SelectItem>
                    <SelectItem value="rejected">已拒絕</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  匯出
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>加班申請記錄 ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {requests.length === 0 ? '暫無加班申請記錄' : '沒有符合條件的記錄'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {new Date(request.overtime_date).toLocaleDateString('zh-TW')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {request.start_time} - {request.end_time} ({request.hours}小時)
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">加班類型</div>
                          <div className="font-medium">{request.overtime_type}</div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">加班原因</div>
                          <div className="text-sm">{request.reason}</div>
                        </div>
                        
                        {request.rejection_reason && (
                          <div className="mb-3">
                            <div className="text-sm text-red-600 mb-1">拒絕原因</div>
                            <div className="text-sm text-red-700 bg-red-50 p-2 rounded">
                              {request.rejection_reason}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          申請時間：{new Date(request.created_at).toLocaleString('zh-TW')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
