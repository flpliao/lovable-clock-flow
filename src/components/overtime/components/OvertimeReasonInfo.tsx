
import React from 'react';
import { FileText } from 'lucide-react';

interface OvertimeReasonInfoProps {
  reason: string;
}

const OvertimeReasonInfo: React.FC<OvertimeReasonInfoProps> = ({ reason }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-white/90" />
        <h4 className="text-base font-medium text-white">原因說明</h4>
      </div>
      
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-white/80 mt-1" />
        <div className="flex-1">
          <span className="text-white/70 text-sm">加班原因:</span>
          <p className="mt-1 text-white leading-relaxed">{reason}</p>
        </div>
      </div>
    </div>
  );
};

export default OvertimeReasonInfo;
