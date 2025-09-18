import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { RequestStatus } from '@/constants/requestStatus';
import { cn } from '@/lib/utils';

const approvalBadgeVariants = cva(
  'inline-flex items-center font-medium px-2 py-1 rounded-lg border transition-all duration-200 cursor-default text-xs',
  {
    variants: {
      status: {
        // 等待審核 - 黃色系
        pending:
          'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300',
        // 已核准 - 綠色系
        approved:
          'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300',
        // 已拒絕 - 紅色系
        rejected: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300',
        // 已取消 - 灰色系
        cancelled:
          'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

export interface ApprovalBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof approvalBadgeVariants> {
  status: RequestStatus;
}

const ApprovalBadge = React.forwardRef<HTMLDivElement, ApprovalBadgeProps>(
  ({ className, status, ...props }, ref) => {
    // 將 RequestStatus 映射到 CVA 變體
    const variantMap: Record<RequestStatus, 'pending' | 'approved' | 'rejected' | 'cancelled'> = {
      [RequestStatus.PENDING]: 'pending',
      [RequestStatus.APPROVED]: 'approved',
      [RequestStatus.REJECTED]: 'rejected',
      [RequestStatus.CANCELLED]: 'cancelled',
    };

    // 狀態顯示文字
    const statusText: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: '等待審核',
      [RequestStatus.APPROVED]: '已核准',
      [RequestStatus.REJECTED]: '已拒絕',
      [RequestStatus.CANCELLED]: '已取消',
    };

    const variant = variantMap[status];

    return (
      <div
        ref={ref}
        className={cn(approvalBadgeVariants({ status: variant }), className)}
        {...props}
      >
        {statusText[status]}
      </div>
    );
  }
);
ApprovalBadge.displayName = 'ApprovalBadge';

export { ApprovalBadge, approvalBadgeVariants };
