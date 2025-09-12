import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubmitButtonProps } from '@/types/button';

const UpdateButton = ({
  type = 'submit',
  onClick,
  children,
  className,
  size = 'default',
  variant = 'default',
  isLoading = false,
  loadingText = '更新中...',
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      size={size}
      disabled={disabled || isLoading}
      className={cn('text-sm', className)}
    >
      <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
        {children || '更新'}
      </ButtonLoader>
    </Button>
  );
};

export default UpdateButton;
