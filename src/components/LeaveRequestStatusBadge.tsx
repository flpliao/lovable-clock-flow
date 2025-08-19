import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/constants/requestStatus';
import React from 'react';

interface LeaveStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  RequestStatus,
  { variant: 'default' | 'secondary' | 'destructive'; text: string }
> = {
  approved: { variant: 'default', text: '已核准' },
  pending: { variant: 'secondary', text: '審核中' },
  rejected: { variant: 'destructive', text: '已拒絕' },
  cancelled: { variant: 'destructive', text: '已取消' },
};

const LeaveRequestStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, className }) => {
  const { variant, text } = statusConfig[status as RequestStatus];
  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  );
};

export default LeaveRequestStatusBadge;
