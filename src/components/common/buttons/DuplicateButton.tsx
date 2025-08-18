import { ButtonLoader } from '@/components/common/ButtonLoader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClickableButtonProps } from '@/types/button';
import { Copy } from 'lucide-react';

const DuplicateButton = ({
  children,
  className,
  size = 'sm',
  onClick,
  disabled = false,
}: ClickableButtonProps) => {
  return (
    <Button
      variant="destructive"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'bg-green-400/20 border-green-400/30 text-green-300 hover:bg-green-400/30 font-medium transition-all duration-200',
        className
      )}
    >
      <ButtonLoader>
        {children || (
          <>
            <Copy className="h-3 w-3 mr-1" />
            複製
          </>
        )}
      </ButtonLoader>
    </Button>
  );
};

export default DuplicateButton;
