
import React from 'react';
import { Clock, User, Calendar } from 'lucide-react';
import ApprovalStatusBadge from './ApprovalStatusBadge';

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
  const getOvertimeTypeText = (type: string) => {
    switch (type) {
      case 'weekday':
        return '平日加班';
      case 'weekend':
        return '假日加班';
      case 'holiday':
        return '國定假日加班';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">加班申請</h3>
            <ApprovalStatusBadge status={status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-white/80">
            {staffName && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{staffName}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{getOvertimeTypeText(overtimeType)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-white/70">
        申請時間: {formatDate(createdAt)}
      </div>
    </div>
  );
};

export default OvertimeCardHeader;
