
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import ApprovalStatusBadge from './ApprovalStatusBadge';

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

interface OvertimeApprovalProcessProps {
  status: string;
  approvedByName?: string;
  approvalDate: string | null;
  approvalComment: string | null;
  rejectionReason?: string;
  overtimeApprovalRecords?: OvertimeApprovalRecord[];
}

const OvertimeApprovalProcess: React.FC<OvertimeApprovalProcessProps> = ({
  status,
  approvedByName,
  approvalDate,
  approvalComment,
  rejectionReason,
  overtimeApprovalRecords
}) => {
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);

  const formatApprovalDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-TW');
  };

  return (
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
            <div className="mt-1"><ApprovalStatusBadge status={status} /></div>
          </div>
          {approvedByName && (
            <div>
              <span className="text-white/70">審核人員:</span>
              <p className="text-white font-medium">{approvedByName}</p>
            </div>
          )}
          {approvalDate && (
            <div>
              <span className="text-white/70">審核時間:</span>
              <p className="text-white font-medium">{formatApprovalDate(approvalDate)}</p>
            </div>
          )}
          {(approvalComment || rejectionReason) && (
            <div>
              <span className="text-white/70">審核意見:</span>
              <p className="text-white">{approvalComment || rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* 詳細審核記錄 */}
      {showApprovalDetails && overtimeApprovalRecords && overtimeApprovalRecords.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-white/90 mb-2">詳細審核記錄</h5>
          {overtimeApprovalRecords.map((record) => (
            <div key={record.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-white/80" />
                  <span className="text-white font-medium text-sm">
                    第 {record.level} 級審核 - {record.approver_name}
                  </span>
                  <ApprovalStatusBadge status={record.status} />
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
      {showApprovalDetails && (!overtimeApprovalRecords || overtimeApprovalRecords.length === 0) && (
        <div className="text-center py-4">
          <div className="text-white/70 text-sm">
            尚無詳細審核記錄
          </div>
        </div>
      )}
    </div>
  );
};

export default OvertimeApprovalProcess;
