import { APPROVAL_STATUS_LABELS, ApprovalStatus } from '@/constants/approvalStatus';

/**
 * 審核狀態的樣式配置
 */
export interface StatusConfig {
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  secondaryTextColor: string;
  statusText: string;
  statusBg: string;
  statusTextColor: string;
  iconName: string; // 圖示名稱字串
}

export const getStatusConfig = (status: ApprovalStatus): StatusConfig => {
  switch (status) {
    case ApprovalStatus.APPROVED:
      return {
        bgGradient: 'from-green-50 to-green-100',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
        secondaryTextColor: 'text-green-600',
        statusText: APPROVAL_STATUS_LABELS[ApprovalStatus.APPROVED],
        statusBg: 'bg-green-500',
        statusTextColor: 'text-green-600',
        iconName: 'CheckCircle2',
      };
    case ApprovalStatus.REJECTED:
      return {
        bgGradient: 'from-red-50 to-red-100',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        secondaryTextColor: 'text-red-600',
        statusText: APPROVAL_STATUS_LABELS[ApprovalStatus.REJECTED],
        statusBg: 'bg-red-500',
        statusTextColor: 'text-red-600',
        iconName: 'XCircle',
      };
    case ApprovalStatus.PENDING:
    default:
      return {
        bgGradient: 'from-orange-50 to-orange-100',
        borderColor: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900',
        secondaryTextColor: 'text-orange-600',
        statusText: APPROVAL_STATUS_LABELS[ApprovalStatus.PENDING],
        statusBg: 'bg-orange-500',
        statusTextColor: 'text-orange-600',
        iconName: 'AlertCircle',
      };
  }
};
