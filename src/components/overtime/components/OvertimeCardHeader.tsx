
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, CheckCircle } from 'lucide-react';
import { getOvertimeTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

interface OvertimeCardHeaderProps {
  staffName?: string;
  status: string;
  overtimeType: string;
  createdAt: string;
}

const OvertimeCardHeader: React.FC<OvertimeCardHeaderProps> = ({
  staffName,
  status,
  overtimeType,
  createdAt
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            {staffName && (
              <span className="text-white font-medium text-sm bg-white/20 px-2 py-1 rounded-lg">
                {staffName}
              </span>
            )}
            <Badge className={`${getExceptionStatusColor(status)} text-sm px-2 py-1 rounded-full font-medium`}>
              {getExceptionStatusText(status)}
            </Badge>
            <span className="text-white/90 text-sm font-medium flex items-center gap-1">
              <User className="h-3 w-3" />
              {getOvertimeTypeText(overtimeType as 'weekday' | 'weekend' | 'holiday')}
            </span>
          </div>
          <p className="text-white/70 text-xs flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            申請時間: {new Date(createdAt).toLocaleString('zh-TW')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OvertimeCardHeader;
