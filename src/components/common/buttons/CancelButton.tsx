import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';

const CancelButton = ({
  type = 'button',
  onClick,
  children = '取消',
  variant = 'outline',
  className,
  size = 'default',
  disabled = false,
}: ClickableButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn('text-sm', className)}
    >
      <ButtonLoader>{children}</ButtonLoader>
    </Button>
  );
};

export default CancelButton;
