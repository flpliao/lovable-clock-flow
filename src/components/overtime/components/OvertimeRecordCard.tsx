
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, DollarSign, FileText, Timer, CheckCircle, User, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

interface OvertimeApprovalRecord {
  id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: string;
  approval_date: string | null;
  comment: string | null;
  created_at: string;
}

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
  approved_by_name?: string;
  approval_date: string | null;
  approval_comment: string | null;
  rejection_reason?: string;
  compensation_hours: number | null;
  updated_at: string;
  staff?: {
    name: string;
  };
  overtime_approval_records?: OvertimeApprovalRecord[];
}

interface OvertimeRecordCardProps {
  overtime: OvertimeRecord;
  showApprovalProcess?: boolean;
}

const OvertimeRecordCard: React.FC<OvertimeRecordCardProps> = ({ 
  overtime, 
  showApprovalProcess = false 
}) => {
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);

  const formatApprovalDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/80 text-white text-xs">已核准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/80 text-white text-xs">已拒絕</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/80 text-white text-xs">待審核</Badge>;
      default:
        return <Badge className="bg-gray-500/80 text-white text-xs">{status}</Badge>;
    }
  };

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
              {overtime.staff?.name && (
                <span className="text-white font-medium text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {overtime.staff.name}
                </span>
              )}
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
      
      {/* 時間資訊區域 */}
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
      
      {/* 補償方式區域 */}
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
      
      {/* 原因說明區域 */}
      <div className="mb-4">
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

      {/* 審核過程區域 */}
      {showApprovalProcess && (
        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-white/90" />
              <h4 className="text-base font-medium text-white">審核過程</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApprovalDetails(!showApprovalDetails)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              {showApprovalDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  展開
                </>
              )}
            </Button>
          </div>

          {/* 基本審核資訊 */}
          <div className="bg-white/10 rounded-lg p-3 border border-white/20 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">當前狀態:</span>
                <div className="mt-1">{getApprovalStatusBadge(overtime.status)}</div>
              </div>
              {overtime.approved_by_name && (
                <div>
                  <span className="text-white/70">審核人員:</span>
                  <p className="text-white font-medium">{overtime.approved_by_name}</p>
                </div>
              )}
              {overtime.approval_date && (
                <div>
                  <span className="text-white/70">審核時間:</span>
                  <p className="text-white font-medium">{formatApprovalDate(overtime.approval_date)}</p>
                </div>
              )}
              {(overtime.approval_comment || overtime.rejection_reason) && (
                <div>
                  <span className="text-white/70">審核意見:</span>
                  <p className="text-white">{overtime.approval_comment || overtime.rejection_reason}</p>
                </div>
              )}
            </div>
          </div>

          {/* 詳細審核記錄 */}
          {showApprovalDetails && overtime.overtime_approval_records && overtime.overtime_approval_records.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-white/90 mb-2">詳細審核記錄</h5>
              {overtime.overtime_approval_records.map((record, index) => (
                <div key={record.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-white/80" />
                      <span className="text-white font-medium text-sm">
                        第 {record.level} 級審核 - {record.approver_name}
                      </span>
                      {getApprovalStatusBadge(record.status)}
                    </div>
                    {record.approval_date && (
                      <span className="text-white/70 text-xs">
                        {formatApprovalDate(record.approval_date)}
                      </span>
                    )}
                  </div>
                  
                  {record.comment && (
                    <div className="text-sm">
                      <span className="text-white/70">審核意見:</span>
                      <p className="text-white mt-1">{record.comment}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-white/60 mt-2">
                    記錄建立時間: {formatApprovalDate(record.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 無審核記錄時的提示 */}
          {showApprovalDetails && (!overtime.overtime_approval_records || overtime.overtime_approval_records.length === 0) && (
            <div className="text-center py-4">
              <div className="text-white/70 text-sm">
                尚無詳細審核記錄
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OvertimeRecordCard;
