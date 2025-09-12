import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubmitButtonProps } from '@/types/button';

const SubmitButton = ({
  type = 'submit',
  onClick,
  children,
  className,
  size = 'default',
  variant = 'default',
  isLoading = false,
  loadingText = '提交中...',
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
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
