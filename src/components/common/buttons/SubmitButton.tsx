import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getButtonContent } from '@/utils/buttonUtils';
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
      {getButtonContent(children, '提交', loading, loadingText)}
    </Button>
  );
};

export default SubmitButton;
