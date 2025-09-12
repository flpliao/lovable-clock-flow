import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableLoadingButtonProps } from '@/types/button';
import { Trash2 } from 'lucide-react';

const DeleteConfirmButton = ({
  type = 'button',
  onClick,
  children,
  className,
  variant = 'destructive',
  size = 'default',
  disabled = false,
  isLoading = false,
}: ClickableLoadingButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
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
};

export default DeleteConfirmButton;
