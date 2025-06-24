
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditRoleDialogFooterProps {
  isSubmitting: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const EditRoleDialogFooter: React.FC<EditRoleDialogFooterProps> = ({
  isSubmitting,
  onPrevious,
  onSubmit
}) => {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔄 點擊儲存變更按鈕');
    onSubmit();
  };

  return (
    <DialogFooter className="mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isSubmitting}
        type="button"
      >
        上一步
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        type="button"
      >
        {isSubmitting ? '儲存中...' : '儲存變更'}
      </Button>
    </DialogFooter>
  );
};
