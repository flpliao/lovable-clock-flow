import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableLoadingButtonProps } from '@/types/button';
import { Trash2 } from 'lucide-react';
import React from 'react';

const DeleteConfirmButton = React.forwardRef<HTMLButtonElement, ClickableLoadingButtonProps>(
  (
    {
      type = 'button',
      onClick,
      children,
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
        variant="destructive"
        size={size}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          className
        )}
      >
        <ButtonLoader isLoading={isLoading} loadingText="刪除中...">
          {children || (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              確認刪除
            </>
          )}
        </ButtonLoader>
      </Button>
    );
  }
);

DeleteConfirmButton.displayName = 'DeleteConfirmButton';

export default DeleteConfirmButton;
