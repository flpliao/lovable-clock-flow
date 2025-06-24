
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
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
  staff_name: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by_name?: string;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  overtime_approval_records?: OvertimeApprovalRecord[];
}

interface HROvertimeCardProps {
  overtime: OvertimeRecord;
}

const HROvertimeCard: React.FC<HROvertimeCardProps> = ({ overtime }) => {
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

          {/* 審核過程區域 */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">審核過程</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApprovalDetails(!showApprovalDetails)}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              >
                {showApprovalDetails ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    收起
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    展開
                  </>
                )}
              </Button>
            </div>

            {/* 基本審核資訊 */}
            <div className="bg-gray-50 rounded p-2 mb-2">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">狀態:</span>
                  {getApprovalStatusBadge(overtime.status)}
                </div>
                {overtime.approved_by_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">審核人:</span>
                    <span className="font-medium">{overtime.approved_by_name}</span>
                  </div>
                )}
                {overtime.approval_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">審核時間:</span>
                    <span className="font-medium">{formatApprovalDate(overtime.approval_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 詳細審核記錄 */}
            {showApprovalDetails && overtime.overtime_approval_records && overtime.overtime_approval_records.length > 0 && (
              <div className="space-y-2">
                {overtime.overtime_approval_records.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          L{record.level} - {record.approver_name}
                        </span>
                        {getApprovalStatusBadge(record.status)}
                      </div>
                      {record.approval_date && (
                        <span className="text-xs text-gray-500">
                          {formatApprovalDate(record.approval_date)}
                        </span>
                      )}
                    </div>
                    
                    {record.comment && (
                      <div className="text-xs">
                        <span className="text-gray-500">意見:</span>
                        <p className="mt-1">{record.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showApprovalDetails && (!overtime.overtime_approval_records || overtime.overtime_approval_records.length === 0) && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-500">無詳細審核記錄</span>
              </div>
            )}
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
