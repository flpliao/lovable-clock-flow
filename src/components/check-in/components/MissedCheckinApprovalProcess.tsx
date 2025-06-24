
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import { MissedCheckinApprovalRecord } from '@/types/missedCheckin';

interface MissedCheckinApprovalProcessProps {
  status: string;
  approvedByName?: string;
  approvalDate: string | null;
  approvalComment: string | null;
  rejectionReason?: string;
  missedCheckinApprovalRecords?: MissedCheckinApprovalRecord[];
}

const MissedCheckinApprovalProcess: React.FC<MissedCheckinApprovalProcessProps> = ({
  status,
  approvedByName,
  approvalDate,
  approvalComment,
  rejectionReason,
  missedCheckinApprovalRecords
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
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-gray-600" />
          <h4 className="text-base font-medium text-gray-800">審核過程</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowApprovalDetails(!showApprovalDetails)}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
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
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">當前狀態:</span>
            <div className="mt-1">{getApprovalStatusBadge(status)}</div>
          </div>
          {approvedByName && (
            <div>
              <span className="text-gray-600">審核人員:</span>
              <p className="text-gray-800 font-medium">{approvedByName}</p>
            </div>
          )}
          {approvalDate && (
            <div>
              <span className="text-gray-600">審核時間:</span>
              <p className="text-gray-800 font-medium">{formatApprovalDate(approvalDate)}</p>
            </div>
          )}
          {(approvalComment || rejectionReason) && (
            <div>
              <span className="text-gray-600">審核意見:</span>
              <p className="text-gray-800">{approvalComment || rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* 詳細審核記錄 */}
      {showApprovalDetails && missedCheckinApprovalRecords && missedCheckinApprovalRecords.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700 mb-2">詳細審核記錄</h5>
          {missedCheckinApprovalRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-800 font-medium text-sm">
                    第 {record.level} 級審核 - {record.approver_name}
                  </span>
                  {getApprovalStatusBadge(record.status)}
                </div>
                {record.approval_date && (
                  <span className="text-gray-500 text-xs">
                    {formatApprovalDate(record.approval_date)}
                  </span>
                )}
              </div>
              
              {record.comment && (
                <div className="text-sm">
                  <span className="text-gray-600">審核意見:</span>
                  <p className="text-gray-800 mt-1">{record.comment}</p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                記錄建立時間: {formatApprovalDate(record.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 無審核記錄時的提示 */}
      {showApprovalDetails && (!missedCheckinApprovalRecords || missedCheckinApprovalRecords.length === 0) && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            尚無詳細審核記錄
          </div>
        </div>
      )}
    </div>
  );
};

export default MissedCheckinApprovalProcess;
