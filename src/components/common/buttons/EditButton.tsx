import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import { Edit } from 'lucide-react';
import React from 'react';

const EditButton = React.forwardRef<HTMLButtonElement, ClickableButtonProps>(
  ({ type = 'button', onClick, children, className, size = 'default', disabled = false }, ref) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant="destructive"
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium transition-all duration-200',
          className
        )}
      >
        <ButtonLoader>
          {children || (
            <>
              <Edit className="h-3 w-3 mr-1" />
              編輯
            </>
          )}
        </ButtonLoader>
      </Button>
    );
  }
);

EditButton.displayName = 'EditButton';

export default EditButton;
