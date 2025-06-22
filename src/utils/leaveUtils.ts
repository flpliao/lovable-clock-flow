
import { LeaveType } from '@/types/hr';

// Helper to get leave type in Chinese
export const getLeaveTypeText = (type: string, leaveTypes?: LeaveType[]): string => {
  if (leaveTypes) {
    const leaveType = leaveTypes.find(t => t.code === type);
    return leaveType?.name_zh || '其他';
  }
  
  // 回退到靜態資料
  const staticTypes: Record<string, string> = {
    'annual': '特別休假',
    'personal': '事假',
    'sick': '病假',
    'marriage': '婚假',
    'bereavement': '喪假',
    'maternity': '產假',
    'paternity': '陪產假',
    'menstrual': '生理假',
    'occupational': '公傷病假',
    'parental': '育嬰留停',
    'other': '其他'
  };
  
  return staticTypes[type] || '其他';
};

// Helper to get status badge color
export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status) {
    case 'approved': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

// Helper to get status text in Chinese
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'approved': return '已核准';
    case 'pending': return '審核中';
    case 'rejected': return '已拒絕';
    default: return '未知';
  }
};

// Calculate work hours between two dates (excluding weekends)
export const calculateWorkHours = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time to start of day for accurate calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  let workDays = 0;
  const current = new Date(start);
  
  // Include both start and end dates
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Only count weekdays (Monday=1 to Friday=5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  // Convert work days to hours (8 hours per work day)
  return workDays * 8;
};
