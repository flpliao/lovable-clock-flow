import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

interface DeleteConfirmButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const DeleteConfirmButton = ({
  children,
  className,
  size = 'default',
  onClick,
  disabled = false,
  isLoading = false,
}: DeleteConfirmButtonProps) => {
  return (
    <Button
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
};

export default DeleteConfirmButton;
