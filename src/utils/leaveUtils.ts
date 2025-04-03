
// Helper functions for leave-related operations

// Helper to get leave type in Chinese
export const getLeaveTypeText = (type: string): string => {
  switch (type) {
    case 'annual': return '特休';
    case 'sick': return '病假';
    case 'personal': return '事假';
    default: return '其他';
  }
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
