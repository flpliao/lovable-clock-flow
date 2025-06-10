
import React from 'react';
import { Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OvertimeSubmitSectionProps {
  isSubmitting: boolean;
}

const OvertimeSubmitSection: React.FC<OvertimeSubmitSectionProps> = ({
  isSubmitting
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
      <Button 
        type="submit" 
        className="w-full h-12 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Clock className="h-5 w-5 mr-2 animate-spin" />
            提交中...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            提交申請
          </>
        )}
      </Button>
    </div>
  );
};

export default OvertimeSubmitSection;
