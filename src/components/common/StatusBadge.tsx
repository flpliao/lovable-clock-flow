import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/constants/requestStatus';
import React from 'react';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig: Record<RequestStatus, { text: string; className: string }> = {
  [RequestStatus.APPROVED]: {
    text: '已核准',
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  },
  [RequestStatus.REJECTED]: {
    text: '已拒絕',
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  },
  [RequestStatus.CANCELLED]: {
    text: '已取消',
    className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  },
  [RequestStatus.PENDING]: {
    text: '審核中',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig[RequestStatus.PENDING];

  return <Badge className={`${config.className} ${className || ''}`}>{config.text}</Badge>;
};

export default StatusBadge;
