
import React from 'react';
import { Button } from '@/components/ui/button';

interface OvertimeSubmitButtonProps {
  isSubmitting: boolean;
}

export const OvertimeSubmitButton: React.FC<OvertimeSubmitButtonProps> = ({
  isSubmitting
}) => {
  return (
    <div className="flex justify-center pt-6">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full backdrop-blur-xl bg-white/30 border border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300 rounded-xl py-4 text-lg"
      >
        {isSubmitting ? '提交中...' : '✈️ 提交申請'}
      </Button>
    </div>
  );
};
