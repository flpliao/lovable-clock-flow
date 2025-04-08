
import { LeaveRequest } from '@/types';

// Mock data for leave history
export const mockLeaveHistory: LeaveRequest[] = [
  {
    id: '1',
    user_id: '1',
    start_date: '2023-10-15',
    end_date: '2023-10-16',
    leave_type: 'annual',
    status: 'approved',
    hours: 16,
    reason: '個人休假',
    approval_level: 3,
    created_at: '2023-10-10T08:00:00Z',
    updated_at: '2023-10-12T14:30:00Z',
    approvals: [
      {
        id: 'a1',
        leave_request_id: '1',
        approver_id: '2',
        approver_name: '王小明',
        status: 'approved',
        level: 1,
        approval_date: '2023-10-11T09:15:00Z'
      },
      {
        id: 'a2',
        leave_request_id: '1',
        approver_id: '3',
        approver_name: '李經理',
        status: 'approved',
        level: 2,
        approval_date: '2023-10-12T11:00:00Z'
      },
      {
        id: 'a3',
        leave_request_id: '1',
        approver_id: '4',
        approver_name: '人事部 張小姐',
        status: 'approved',
        level: 3,
        approval_date: '2023-10-12T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    user_id: '1',
    start_date: '2023-11-05',
    end_date: '2023-11-05',
    leave_type: 'sick',
    status: 'approved',
    hours: 8,
    reason: '感冒就醫',
    approval_level: 2,
    created_at: '2023-11-03T10:20:00Z',
    updated_at: '2023-11-04T15:45:00Z',
    approvals: [
      {
        id: 'b1',
        leave_request_id: '2',
        approver_id: '2',
        approver_name: '王小明',
        status: 'approved',
        level: 1,
        approval_date: '2023-11-03T14:00:00Z'
      },
      {
        id: 'b2',
        leave_request_id: '2',
        approver_id: '3',
        approver_name: '李經理',
        status: 'approved',
        level: 2,
        approval_date: '2023-11-04T15:45:00Z'
      }
    ]
  },
  {
    id: '3',
    user_id: '1',
    start_date: '2023-12-25',
    end_date: '2023-12-27',
    leave_type: 'annual',
    status: 'rejected',
    hours: 24,
    reason: '聖誕假期',
    approval_level: 1,
    rejection_reason: '因年底專案繁忙，請調整假期時間',
    created_at: '2023-12-15T09:30:00Z',
    updated_at: '2023-12-16T11:20:00Z',
    approvals: [
      {
        id: 'c1',
        leave_request_id: '3',
        approver_id: '2',
        approver_name: '王小明',
        status: 'rejected',
        level: 1,
        comment: '因年底專案繁忙，請調整假期時間',
        approval_date: '2023-12-16T11:20:00Z'
      }
    ]
  }
];
