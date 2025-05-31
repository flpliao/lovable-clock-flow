
import { AttendanceException } from '@/types/attendance';

export const getExceptionTypeText = (type: string): string => {
  const types: Record<string, string> = {
    'missing_check_in': '漏打上班卡',
    'missing_check_out': '漏打下班卡',
    'late_check_in': '遲到',
    'early_check_out': '早退',
    'manual_adjustment': '人工調整'
  };
  return types[type] || '未知';
};

export const getExceptionStatusText = (status: string): string => {
  const statuses: Record<string, string> = {
    'pending': '待審核',
    'approved': '已核准',
    'rejected': '已拒絕'
  };
  return statuses[status] || '未知';
};

export const getExceptionStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
