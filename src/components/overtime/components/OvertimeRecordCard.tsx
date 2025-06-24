
import React from 'react';
import OvertimeCardHeader from './OvertimeCardHeader';
import OvertimeTimeInfo from './OvertimeTimeInfo';
import OvertimeCompensationInfo from './OvertimeCompensationInfo';
import OvertimeReasonInfo from './OvertimeReasonInfo';
import OvertimeApprovalProcess from './OvertimeApprovalProcess';

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
  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-lg p-6 hover:bg-white/35 transition-all duration-300">
      <OvertimeCardHeader
        staffName={overtime.staff?.name}
        status={overtime.status}
        overtimeType={overtime.overtime_type}
        createdAt={overtime.created_at}
      />
      
      <OvertimeTimeInfo
        overtimeDate={overtime.overtime_date}
        startTime={overtime.start_time}
        endTime={overtime.end_time}
        hours={overtime.hours}
      />
      
      <OvertimeCompensationInfo
        compensationType={overtime.compensation_type}
      />
      
      <OvertimeReasonInfo
        reason={overtime.reason}
      />

      {showApprovalProcess && (
        <OvertimeApprovalProcess
          status={overtime.status}
          approvedByName={overtime.approved_by_name}
          approvalDate={overtime.approval_date}
          approvalComment={overtime.approval_comment}
          rejectionReason={overtime.rejection_reason}
          overtimeApprovalRecords={overtime.overtime_approval_records}
        />
      )}
    </div>
  );
};

export default OvertimeRecordCard;
