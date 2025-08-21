import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import React from 'react';

interface CustomFormLabelProps extends React.ComponentProps<typeof FormLabel> {
  children: React.ReactNode;
  required?: boolean;
}

const CustomFormLabel = React.forwardRef<React.ElementRef<typeof FormLabel>, CustomFormLabelProps>(
  ({ children, className, required = false, ...props }, ref) => {
    return (
      <FormLabel ref={ref} className={cn('text-muted-foreground', className)} {...props}>
        {children} {required && <span className="text-red-500">*</span>}
      </FormLabel>
    );
  }
);

CustomFormLabel.displayName = 'CustomFormLabel';

export default CustomFormLabel;
