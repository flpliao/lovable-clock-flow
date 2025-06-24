
import React from 'react';
import { DollarSign } from 'lucide-react';
import { getCompensationTypeText } from '@/utils/overtimeUtils';

interface OvertimeCompensationInfoProps {
  compensationType: string;
}

const OvertimeCompensationInfo: React.FC<OvertimeCompensationInfoProps> = ({
  compensationType
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4 text-white/90" />
        <h4 className="text-base font-medium text-white">補償方式</h4>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="h-4 w-4 text-white/80" />
        <div>
          <span className="text-white/70">補償類型:</span>
          <p className="font-medium text-white">{getCompensationTypeText(compensationType as 'pay' | 'time_off' | 'both')}</p>
        </div>
      </div>
    </div>
  );
};

export default OvertimeCompensationInfo;
