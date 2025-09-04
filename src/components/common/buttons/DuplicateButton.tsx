import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import { Copy } from 'lucide-react';
import React from 'react';

const DuplicateButton = React.forwardRef<HTMLButtonElement, ClickableButtonProps>(
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
          'bg-green-400/20 border-green-400/30 text-green-300 hover:bg-green-400/30 font-medium transition-all duration-200',
          className
        )}
      >
        <ButtonLoader>
          {children || (
            <>
              <Copy className="h-3 w-3 mr-1" />
              複製
            </>
          )}
        </ButtonLoader>
      </Button>
    );
  }
);

DuplicateButton.displayName = 'DuplicateButton';

export default DuplicateButton;
