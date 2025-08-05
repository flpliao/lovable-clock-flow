import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SubmitButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

const SubmitButton = ({
  children,
  className,
  size = 'default',
  isLoading = false,
  loadingText,
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      variant="default"
      size={size}
      disabled={disabled || isLoading}
      className={cn('text-sm', className)}
    >
      <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
        {children || '提交'}
      </ButtonLoader>
    </Button>
  );
};

export default SubmitButton;
