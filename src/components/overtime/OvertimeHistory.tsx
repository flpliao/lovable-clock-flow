
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeRequest } from '@/types/overtime';

const OvertimeHistory: React.FC = () => {
  const { currentUser } = useUser();
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadOvertimeHistory();
    }
  }, [currentUser?.id]);

  const loadOvertimeHistory = async () => {
    if (!currentUser?.id) return;
    
    try {
      const data = await overtimeService.getUserOvertimeRequests(currentUser.id);
      setRequests(data);
    } catch (error) {
      console.error('載入加班記錄失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '待審核', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      approved: { text: '已核准', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒絕', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      cancelled: { text: '已取消', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' }
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
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">載入中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            加班申請記錄
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暫無加班申請記錄
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
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
  );
};

export default OvertimeHistory;
