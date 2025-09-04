import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubmitButtonProps } from '@/types/button';

const SaveButton = ({
  type = 'submit',
  onClick,
  children,
  className,
  size = 'default',
  isLoading = false,
  loadingText = '儲存中...',
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      variant="default"
      size={size}
      disabled={disabled || isLoading}
      className={cn('text-sm', className)}
      onClick={onClick}
    >
      <ButtonLoader isLoading={isLoading} loadingText={loadingText}>
        {children || '儲存'}
      </ButtonLoader>
    </Button>
  );
};

export default SaveButton;
