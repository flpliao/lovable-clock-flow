import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImportButtonProps } from '@/types/button';
import { Upload } from 'lucide-react';
import React from 'react';

const ImportButton: React.FC<ImportButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  variant = 'outline',
  size = 'default',
  children = '匯入',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30',
        className
      )}
    >
      <Upload className="h-3 w-3 mr-1" />
      {children}
    </Button>
  );
};

export default ImportButton;
