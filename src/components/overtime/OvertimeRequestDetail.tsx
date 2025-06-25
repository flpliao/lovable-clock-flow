
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, FileText, ArrowLeft } from 'lucide-react';
import { OvertimeRequest } from '@/types/overtime';
import { format } from 'date-fns';

interface OvertimeRequestDetailProps {
  overtimeRequest: OvertimeRequest;
  isApprover?: boolean;
  onBack?: () => void;
}

const OvertimeRequestDetail: React.FC<OvertimeRequestDetailProps> = ({
  overtimeRequest,
  isApprover = false,
  onBack
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已核准';
      case 'rejected':
        return '已拒絕';
      case 'pending':
        return '待審核';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              加班申請詳情
            </CardTitle>
            <Badge className={getStatusColor(overtimeRequest.status)}>
              {getStatusText(overtimeRequest.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">加班日期</p>
                  <p className="font-medium">{overtimeRequest.overtime_date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">加班時間</p>
                  <p className="font-medium">
                    {overtimeRequest.start_time} - {overtimeRequest.end_time}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">加班時數</p>
                  <p className="font-medium">{overtimeRequest.hours} 小時</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">申請時間</p>
                <p className="font-medium">
                  {format(new Date(overtimeRequest.created_at), 'yyyy/MM/dd HH:mm')}
                </p>
              </div>
              
              {overtimeRequest.updated_at !== overtimeRequest.created_at && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">更新時間</p>
                  <p className="font-medium">
                    {format(new Date(overtimeRequest.updated_at), 'yyyy/MM/dd HH:mm')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-600">加班原因</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{overtimeRequest.reason}</p>
            </div>
          </div>
          
          {overtimeRequest.rejection_reason && (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium">拒絕原因</p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-700">{overtimeRequest.rejection_reason}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OvertimeRequestDetail;
