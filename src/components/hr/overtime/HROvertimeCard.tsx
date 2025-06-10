
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

interface OvertimeRecord {
  id: string;
  staff_name: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface HROvertimeCardProps {
  overtime: OvertimeRecord;
}

const HROvertimeCard: React.FC<HROvertimeCardProps> = ({ overtime }) => {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-sm">{overtime.staff_name}</h3>
                <Badge className={`${getExceptionStatusColor(overtime.status)} text-xs`}>
                  {getExceptionStatusText(overtime.status)}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {getOvertimeTypeText(overtime.overtime_type)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">日期:</span>
              <p className="font-medium">{overtime.overtime_date}</p>
            </div>
            <div>
              <span className="text-gray-500">時數:</span>
              <p className="font-bold text-purple-600">{overtime.hours} 小時</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">補償方式:</span>
              <p className="font-medium">{getCompensationTypeText(overtime.compensation_type)}</p>
            </div>
            <div>
              <span className="text-gray-500">時間:</span>
              <p className="font-medium">
                {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="pt-1 border-t border-gray-100">
            <div className="text-xs">
              <span className="text-gray-500">原因:</span>
              <p className="mt-1">{overtime.reason}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              查看詳情
            </Button>
            {overtime.status === 'pending' && (
              <>
                <Button variant="outline" size="sm" className="text-green-600 text-xs">
                  核准
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 text-xs">
                  拒絕
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HROvertimeCard;
