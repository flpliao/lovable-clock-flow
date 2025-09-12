import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import { Trash2 } from 'lucide-react';

const DeleteButton = ({
  type = 'button',
  onClick,
  children,
  className,
  variant = 'destructive',
  size = 'sm',
  disabled = false,
}: ClickableButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
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
};

export default DeleteButton;
