
import { LeaveRequest, ApprovalRecord } from '@/types';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { format } from 'date-fns';

// Mock approvers data
const approversData = [
  { id: '2', name: '王小明', position: '組長', level: 1 },
  { id: '3', name: '李經理', position: '經理', level: 2 },
  { id: '4', name: '人事部 張小姐', position: '人事專員', level: 3 }
];

export const getApprovers = () => {
  return approversData;
};

export const createLeaveRequest = (data: LeaveFormValues, userId: string, calculatedHours: number): LeaveRequest => {
  // Create approval records for the leave request
  const approvals: ApprovalRecord[] = approversData.map(approver => ({
    id: `approval-${Math.random().toString(36).substr(2, 9)}`,
    leave_request_id: `leave-${Math.random().toString(36).substr(2, 9)}`,
    approver_id: approver.id,
    approver_name: approver.name,
    status: 'pending',
    level: approver.level
  }));
  
  // Create a leave request with calculated hours and approval workflow
  const leaveRequest: LeaveRequest = {
    id: `leave-${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    start_date: format(data.start_date, 'yyyy-MM-dd'),
    end_date: format(data.end_date, 'yyyy-MM-dd'),
    leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'other',
    status: 'pending',
    hours: calculatedHours,
    reason: data.reason,
    approvals: approvals,
    approval_level: 1, // Start at the first approval level
    current_approver: approversData[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return leaveRequest;
};
