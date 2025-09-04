import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import React from 'react';

const CancelButton = React.forwardRef<HTMLButtonElement, ClickableButtonProps>(
  ({ type = 'button', onClick, children, className, size = 'default', disabled = false }, ref) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant="outline"
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn('text-sm', className)}
      >
        <ButtonLoader>{children || '取消'}</ButtonLoader>
      </Button>
    );
  }
);

CancelButton.displayName = 'CancelButton';

export default CancelButton;
