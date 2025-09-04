import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubmitButtonProps } from '@/types/button';
import React from 'react';

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      type = 'submit',
      onClick,
      children,
      className,
      size = 'default',
      isLoading = false,
      loadingText = '提交中...',
      disabled = false,
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type={type}
        onClick={onClick}
        variant="default"
        size={size}
        disabled={disabled || isLoading}
        className={cn('text-sm', className)}
      >
        <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
          {children || '提交'}
        </ButtonLoader>
      </Button>
    );
  }
);

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
