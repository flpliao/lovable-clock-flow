import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import React from 'react';

interface ImportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const ImportButton: React.FC<ImportButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  size = 'default',
  children = '匯入',
}) => {
  return (
    <Button
      variant="outline"
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
