import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CancelButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const CancelButton = ({
  children,
  className,
  size = 'default',
  onClick,
  disabled = false,
}: CancelButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn('text-sm', className)}
    >
      <ButtonLoader defaultContent="取消">{children}</ButtonLoader>
    </Button>
  );
};

export default CancelButton;
