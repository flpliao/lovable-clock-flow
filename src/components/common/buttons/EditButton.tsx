import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import { ReactNode } from 'react';

interface EditButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const EditButton = ({
  children,
  className,
  size = 'sm',
  onClick,
  disabled = false,
}: EditButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium transition-all duration-200',
        className
      )}
    >
      <ButtonLoader>
        {children || (
          <>
            <Edit className="h-3 w-3 mr-1" />
            編輯
          </>
        )}
      </ButtonLoader>
    </Button>
  );
};

export default EditButton;
