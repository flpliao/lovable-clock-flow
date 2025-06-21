
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormSubmitSectionProps {
  canSubmit: boolean;
  isSubmitting: boolean;
}

export function FormSubmitSection({ canSubmit, isSubmitting }: FormSubmitSectionProps) {
  return (
    <div className="flex justify-center pt-6">
      <Button 
        type="submit" 
        disabled={!canSubmit}
        className={`w-full sm:w-auto px-8 py-3 backdrop-blur-xl border border-white/40 font-semibold shadow-lg transition-all duration-300 rounded-xl ${
          canSubmit 
            ? 'bg-white/30 text-white hover:bg-white/50' 
            : 'bg-gray-400/30 text-gray-300 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            提交中...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            提交請假申請
          </>
        )}
      </Button>
    </div>
  );
}
