
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
  return (
    <DialogFooter className="mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isSubmitting}
      >
        上一步
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? '儲存中...' : '儲存變更'}
      </Button>
    </DialogFooter>
  );
};
