import { Label } from '@/components/ui/label';
import React from 'react';

interface RequiredLabelProps extends React.ComponentProps<typeof Label> {
  children: React.ReactNode;
}

const RequiredLabel = React.forwardRef<React.ElementRef<typeof Label>, RequiredLabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <Label ref={ref} {...props}>
        {children} <span className="text-red-500">*</span>
      </Label>
    );
  }
);

RequiredLabel.displayName = 'RequiredLabel';

export default RequiredLabel;
