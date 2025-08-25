// Helper to get leave type in Chinese
// 注意：此函數現在需要傳入假別類型資料，因為不再使用僵硬編碼的資料
export const getLeaveTypeText = (
  type: string,
  leaveTypes?: Array<{ code: string; name: string }>
): string => {
  if (leaveTypes) {
    const leaveType = leaveTypes.find(lt => lt.code.toLowerCase() === type.toLowerCase());
    return leaveType?.name || '其他';
  }
  return '其他';
};

// Helper to get status badge color
export const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// Helper to get status text in Chinese
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'approved':
      return '已核准';
    case 'pending':
      return '審核中';
    case 'rejected':
      return '已拒絕';
    default:
      return '未知';
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
