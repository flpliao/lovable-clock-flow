export interface AttendanceStatusConfig {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

export const attendanceStatusConfig: Record<string, AttendanceStatusConfig> = {
  scheduled: {
    text: '已排班',
    color: '#3B82F6',
    bgColor: '#EBF8FF',
    borderColor: '#3B82F6',
    icon: 'calendar',
    description: '未來排班日',
  },
  pending: {
    text: '待打卡',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    icon: 'clock',
    description: '等待上班打卡',
  },
  in_progress: {
    text: '進行中',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#10B981',
    icon: 'play-circle',
    description: '工作中，等待下班打卡',
  },
  normal: {
    text: '正常',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#10B981',
    icon: 'check-circle',
    description: '正常出勤',
  },
  abnormal: {
    text: '異常',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#EF4444',
    icon: 'exclamation-triangle',
    description: '遲到或早退',
  },
  absent: {
    text: '缺勤',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#DC2626',
    icon: 'x-circle',
    description: '未出勤',
  },
  incomplete: {
    text: '不完整',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    icon: 'alert-circle',
    description: '打卡不完整',
  },
  off: {
    text: '休息',
    color: '#6B7280',
    bgColor: '#F9FAFB',
    borderColor: '#6B7280',
    icon: 'moon',
    description: '休息日',
  },
};

// 需要高亮顯示的異常狀態
export const abnormalStatuses = ['abnormal', 'absent', 'incomplete'];

// 需要即時更新的狀態（今天的狀態）
export const realtimeStatuses = ['pending', 'in_progress'];

// 未來日期狀態
export const futureStatuses = ['scheduled'];
