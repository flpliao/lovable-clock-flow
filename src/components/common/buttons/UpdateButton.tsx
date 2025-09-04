import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubmitButtonProps } from '@/types/button';
import React from 'react';

const UpdateButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      type = 'submit',
      onClick,
      children,
      className,
      size = 'default',
      isLoading = false,
      loadingText = '更新中...',
      disabled = false,
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant="default"
        onClick={onClick}
        size={size}
        disabled={disabled || isLoading}
        className={cn('text-sm', className)}
      >
        <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
          {children || '更新'}
        </ButtonLoader>
      </Button>
    );
  }
);

UpdateButton.displayName = 'UpdateButton';

export default UpdateButton;
