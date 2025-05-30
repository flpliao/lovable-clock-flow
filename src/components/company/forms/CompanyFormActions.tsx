
import React from 'react';
import { Button } from '@/components/ui/button';

interface CompanyFormActionsProps {
  isSubmitting: boolean;
  hasPermission: boolean;
  onCancel: () => void;
}

const CompanyFormActions: React.FC<CompanyFormActionsProps> = ({
  isSubmitting,
  hasPermission,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        取消
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || !hasPermission}
      >
        {isSubmitting ? '儲存中...' : '儲存'}
      </Button>
    </div>
  );
};

export default CompanyFormActions;
