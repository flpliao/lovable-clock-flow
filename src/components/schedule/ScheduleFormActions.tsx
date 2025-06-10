
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

interface ScheduleFormActionsProps {
  loading: boolean;
  disabled: boolean;
}

const ScheduleFormActions = ({ loading, disabled }: ScheduleFormActionsProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full h-14 text-lg font-semibold bg-white/30 hover:bg-white/40 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl border border-white/40"
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>提交中...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>提交排班</span>
        </div>
      )}
    </Button>
  );
};

export default ScheduleFormActions;
