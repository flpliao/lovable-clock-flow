
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
      className="w-full h-16 text-xl font-bold bg-white/20 hover:bg-white/30 text-black rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl border border-white/30 shadow-xl"
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>提交中...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Plus className="h-6 w-6" />
          <span>提交排班</span>
        </div>
      )}
    </Button>
  );
};

export default ScheduleFormActions;
