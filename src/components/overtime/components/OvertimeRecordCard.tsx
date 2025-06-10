
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, DollarSign, FileText, Timer, CheckCircle } from 'lucide-react';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

interface OvertimeRecord {
  id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface OvertimeRecordCardProps {
  overtime: OvertimeRecord;
}

const OvertimeRecordCard: React.FC<OvertimeRecordCardProps> = ({ overtime }) => {
  return (
    <div className="space-y-6">
      {/* 狀態和基本資訊 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/80 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/50">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <Badge className={`${getExceptionStatusColor(overtime.status)} text-sm px-3 py-1 rounded-full`}>
                {getExceptionStatusText(overtime.status)}
              </Badge>
              <span className="text-white/80 text-sm font-medium">
                {getOvertimeTypeText(overtime.overtime_type)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 時間和日期資訊 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-white/80" />
          <h4 className="text-lg font-medium text-white">時間資訊</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-white/70" />
            <div>
              <span className="text-white/70 text-sm">日期:</span>
              <p className="font-medium text-white">{overtime.overtime_date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 text-white/70" />
            <div>
              <span className="text-white/70 text-sm">時數:</span>
              <p className="font-bold text-purple-200">{overtime.hours} 小時</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-white/70" />
            <div>
              <span className="text-white/70 text-sm">時間:</span>
              <p className="font-medium text-white">
                {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 text-white/70" />
            <div>
              <span className="text-white/70 text-sm">補償方式:</span>
              <p className="font-medium text-white">{getCompensationTypeText(overtime.compensation_type)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 原因說明 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-5 w-5 text-white/80" />
          <h4 className="text-lg font-medium text-white">原因說明</h4>
        </div>
        
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-white/70 mt-1" />
          <div className="flex-1">
            <span className="text-white/70 text-sm">原因:</span>
            <p className="mt-1 text-white">{overtime.reason}</p>
          </div>
        </div>
      </div>
      
      {/* 申請時間 */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-4">
        <div className="text-sm text-white/60 flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          申請時間: {new Date(overtime.created_at).toLocaleString('zh-TW')}
        </div>
      </div>
    </div>
  );
};

export default OvertimeRecordCard;
