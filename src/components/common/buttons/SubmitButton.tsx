import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SubmitButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
  loadingText?: string;
}

const SubmitButton = ({
  children,
  className,
  size = 'default',
  loading = false,
  loadingText,
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      variant="default"
      size={size}
      disabled={disabled || loading}
      className={cn('text-sm', className)}
    >
      <ButtonLoader defaultContent="提交" loading={loading} loadingText={loadingText}>
        {children}
      </ButtonLoader>
    </Button>
  );
};

export default SubmitButton;
