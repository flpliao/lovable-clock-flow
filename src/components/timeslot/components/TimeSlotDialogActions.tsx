
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeSlotDialogActionsProps {
  onCancel: () => void;
  submitText?: string;
  isSubmitting?: boolean;
}

const TimeSlotDialogActions = ({ 
  onCancel, 
  submitText = '新增',
  isSubmitting = false 
}: TimeSlotDialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        取消
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '處理中...' : submitText}
      </Button>
    </div>
  );
};

export default TimeSlotDialogActions;
