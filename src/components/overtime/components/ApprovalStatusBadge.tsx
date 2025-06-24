
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ApprovalStatusBadgeProps {
  status: string;
}

const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500/80 text-white text-xs">已核准</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500/80 text-white text-xs">已拒絕</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500/80 text-white text-xs">待審核</Badge>;
    default:
      return <Badge className="bg-gray-500/80 text-white text-xs">{status}</Badge>;
  }
};

export default ApprovalStatusBadge;
