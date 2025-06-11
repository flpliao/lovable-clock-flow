
import React from 'react';
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OvertimeReasonSectionProps {
  reason: string;
  onReasonChange: (value: string) => void;
}

const OvertimeReasonSection: React.FC<OvertimeReasonSectionProps> = ({
  reason,
  onReasonChange
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/15 border border-white/25 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-5 w-5 text-black" />
        <h4 className="text-lg font-medium text-black">加班原因</h4>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="reason" className="flex items-center gap-2 text-black font-medium">
          <FileText className="h-4 w-4" />
          詳細說明
        </Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="請詳細說明加班原因..."
          className="min-h-[100px] bg-white/40 backdrop-blur-xl border-white/50 text-black placeholder-black/60 rounded-xl font-medium resize-none"
          required
        />
      </div>
    </div>
  );
};

export default OvertimeReasonSection;
