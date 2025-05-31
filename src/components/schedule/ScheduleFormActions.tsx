
import React from 'react';
import { Button } from '@/components/ui/button';

interface ScheduleFormActionsProps {
  loading: boolean;
  disabled: boolean;
}

const ScheduleFormActions = ({ loading, disabled }: ScheduleFormActionsProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={disabled}
    >
      {loading ? '提交中...' : '提交排班'}
    </Button>
  );
};

export default ScheduleFormActions;
