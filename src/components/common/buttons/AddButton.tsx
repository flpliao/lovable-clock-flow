import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AddButtonProps } from '@/types/button';
import { Plus } from 'lucide-react';
import React from 'react';

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  (
    {
      type = 'button',
      onClick,
      children,
      buttonText = '新增',
      className,
      size = 'default',
      disabled = false,
      isLoading = false,
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant="default"
        size={size}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
          'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700',
          className
        )}
      >
        <ButtonLoader isLoading={isLoading} loadingText="新增中...">
          {children || (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </ButtonLoader>
      </Button>
    );
  }
);

AddButton.displayName = 'AddButton';

export default AddButton;
