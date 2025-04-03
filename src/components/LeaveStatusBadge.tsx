
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeVariant, getStatusText } from '@/utils/leaveUtils';

interface LeaveStatusBadgeProps {
  status: string;
}

const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status }) => {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusText(status)}
    </Badge>
  );
};

export default LeaveStatusBadge;
