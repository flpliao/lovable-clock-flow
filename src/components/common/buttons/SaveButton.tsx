import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SaveButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

const SaveButton = ({
  children,
  className,
  size = 'default',
  isLoading = false,
  loadingText = '儲存中...',
  disabled = false,
}: SaveButtonProps) => {
  return (
    <Button
      type="submit"
      variant="default"
      size={size}
      disabled={disabled || isLoading}
      className={cn('text-sm', className)}
    >
      <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
        {children || '儲存'}
      </ButtonLoader>
    </Button>
  );
};

export default SaveButton;
