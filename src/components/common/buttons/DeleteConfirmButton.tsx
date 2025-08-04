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
  loading?: boolean;
}

const DeleteConfirmButton = ({
  children,
  className,
  size = 'default',
  onClick,
  disabled = false,
  loading = false,
}: DeleteConfirmButtonProps) => {
  const defaultContent = (
    <>
      <Trash2 className="h-4 w-4 mr-2" />
      確認刪除
    </>
  );

  return (
    <Button
      variant="destructive"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 font-medium transition-all duration-200',
        className
      )}
    >
      <ButtonLoader defaultContent={defaultContent} loading={loading} loadingText="刪除中...">
        {children}
      </ButtonLoader>
    </Button>
  );
};

export default DeleteConfirmButton;
