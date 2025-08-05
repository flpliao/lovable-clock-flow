import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface AddButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  buttonText?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const AddButton = ({
  children,
  buttonText = '新增',
  className,
  size = 'default',
  onClick,
  disabled = false,
  isLoading = false,
}: AddButtonProps) => {
  return (
    <Button
      variant="default"
      size={size}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700',
        className
      )}
    >
      <ButtonLoader isLoading={isLoading} loadingText="新增中...">
        {children || (
          <>
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </>
        )}
      </ButtonLoader>
    </Button>
  );
};

export default AddButton;
