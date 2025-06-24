
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, DollarSign, FileText, Timer, CheckCircle, User } from 'lucide-react';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

interface OvertimeRecord {
  id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  staff_id: string;
  approved_by: string | null;
  approval_date: string | null;
  approval_comment: string | null;
  compensation_hours: number | null;
  updated_at: string;
}

interface OvertimeRecordCardProps {
  overtime: OvertimeRecord;
}

const OvertimeRecordCard: React.FC<OvertimeRecordCardProps> = ({ overtime }) => {
  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-lg p-6 hover:bg-white/35 transition-all duration-300">
      {/* 標題和狀態區域 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge className={`${getExceptionStatusColor(overtime.status)} text-sm px-2 py-1 rounded-full font-medium`}>
                {getExceptionStatusText(overtime.status)}
              </Badge>
              <span className="text-white/90 text-sm font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                {getOvertimeTypeText(overtime.overtime_type as 'weekday' | 'weekend' | 'holiday')}
              </span>
            </div>
            <p className="text-white/70 text-xs flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              申請時間: {new Date(overtime.created_at).toLocaleString('zh-TW')}
            </p>
          </div>
        </div>
      </div>
      
      {/* 時間資訊區域 - 簡化設計 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-white/90" />
          <h4 className="text-base font-medium text-white">時間資訊</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-white/80" />
            <div>
              <span className="text-white/70">日期:</span>
              <p className="font-medium text-white">{overtime.overtime_date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-white/80" />
            <div>
              <span className="text-white/70">時間:</span>
              <p className="font-medium text-white">
                {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-white/80" />
            <div>
              <span className="text-white/70">時數:</span>
              <p className="font-bold text-purple-200">{overtime.hours} 小時</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 補償方式區域 - 簡化設計 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-white/90" />
          <h4 className="text-base font-medium text-white">補償方式</h4>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-white/80" />
          <div>
            <span className="text-white/70">補償類型:</span>
            <p className="font-medium text-white">{getCompensationTypeText(overtime.compensation_type as 'pay' | 'time_off' | 'both')}</p>
          </div>
        </div>
      </div>
      
      {/* 原因說明區域 - 簡化設計 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-white/90" />
          <h4 className="text-base font-medium text-white">原因說明</h4>
        </div>
        
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-white/80 mt-1" />
          <div className="flex-1">
            <span className="text-white/70 text-sm">加班原因:</span>
            <p className="mt-1 text-white leading-relaxed">{overtime.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeRecordCard;
