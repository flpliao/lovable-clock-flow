import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface AddButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const AddButton = ({
  children,
  className,
  size = 'default',
  onClick,
  disabled = false,
  loading = false,
}: AddButtonProps) => {
  const defaultContent = (
    <>
      <Plus className="h-4 w-4 mr-2" />
      新增
    </>
  );

  const customContent = children ? (
    <>
      <Plus className="h-4 w-4 mr-2" />
      {children}
    </>
  ) : (
    defaultContent
  );

  return (
    <Button
      variant="default"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700',
        className
      )}
    >
      <ButtonLoader defaultContent={defaultContent} loading={loading} loadingText="新增中...">
        {customContent}
      </ButtonLoader>
    </Button>
  );
};

export default AddButton;
