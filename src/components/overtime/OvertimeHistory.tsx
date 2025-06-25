
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User, FileText } from 'lucide-react';
import { OvertimeRequest } from '@/types/overtime';
import { format } from 'date-fns';

interface OvertimeHistoryProps {
  onClick?: (overtime: OvertimeRequest) => void;
}

const OvertimeHistory: React.FC<OvertimeHistoryProps> = ({ onClick }) => {
  // 模擬資料 - 實際使用時應該從 API 獲取
  const overtimeHistory: OvertimeRequest[] = [
    {
      id: '1',
      overtime_date: '2024-06-20',
      start_time: '18:00',
      end_time: '20:00',
      hours: 2,
      reason: '專案趕工',
      status: 'approved',
      created_at: '2024-06-20T10:00:00Z',
      updated_at: '2024-06-20T10:00:00Z'
    },
    {
      id: '2',
      overtime_date: '2024-06-21',
      start_time: '19:00',
      end_time: '22:00',
      hours: 3,
      reason: '系統維護',
      status: 'pending',
      created_at: '2024-06-21T10:00:00Z',
      updated_at: '2024-06-21T10:00:00Z'
    }
  ];

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

  const handleClick = (overtime: OvertimeRequest) => {
    if (onClick) {
      onClick(overtime);
    }
  };

  return (
    <div className="space-y-3">
      {overtimeHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">尚無加班記錄</p>
          <p className="text-gray-500 mt-1">您的加班記錄將會顯示在這裡</p>
        </div>
      ) : (
        overtimeHistory.map((overtime) => (
          <Card 
            key={overtime.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleClick(overtime)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{overtime.overtime_date}</span>
                </div>
                <Badge className={getStatusColor(overtime.status)}>
                  {getStatusText(overtime.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{overtime.start_time} - {overtime.end_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{overtime.hours} 小時</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-gray-700 line-clamp-2">{overtime.reason}</p>
              </div>
              
              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                申請時間: {format(new Date(overtime.created_at), 'yyyy/MM/dd HH:mm')}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OvertimeHistory;
