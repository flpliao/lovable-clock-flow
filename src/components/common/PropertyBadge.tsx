import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const propertyBadgeVariants = cva(
  'inline-flex items-center font-medium px-2 py-1 rounded-lg border transition-all duration-200 cursor-default text-xs',
  {
    variants: {
      status: {
        // 綠色系 - 正面狀態
        success:
          'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400',
        // 黃色系 - 警告狀態
        warning:
          'bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400',
        // 藍色系 - 資訊狀態
        info: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 hover:border-blue-400',
        // 紅色系 - 錯誤/停用狀態
        error: 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100 hover:border-red-400',
        // 灰色系 - 中性狀態
        neutral:
          'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

export interface PropertyBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof propertyBadgeVariants> {
  children: React.ReactNode;
}

const PropertyBadge = React.forwardRef<HTMLDivElement, PropertyBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(propertyBadgeVariants({ status }), className)} {...props}>
        {children}
      </div>
    );
  }
);
PropertyBadge.displayName = 'PropertyBadge';

export { PropertyBadge, propertyBadgeVariants };
