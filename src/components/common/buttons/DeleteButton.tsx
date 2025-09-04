import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import { Trash2 } from 'lucide-react';
import React from 'react';

const DeleteButton = React.forwardRef<HTMLButtonElement, ClickableButtonProps>(
  ({ type = 'button', onClick, children, className, size = 'sm', disabled = false }, ref) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant="destructive"
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 font-medium transition-all duration-200',
          className
        )}
      >
        <ButtonLoader>
          {children || (
            <>
              <Trash2 className="h-4 w-4" />
              移除
            </>
          )}
        </ButtonLoader>
      </Button>
    );
  }
);

DeleteButton.displayName = 'DeleteButton';

export default DeleteButton;
